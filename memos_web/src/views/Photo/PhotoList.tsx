import React, { useState, useEffect } from "react";
import { Button, message, Tag, Flex, Modal, Empty, Typography, Input } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import type { Photo } from "@/types/index";
import { useNavigate, useSearchParams } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getPhotoAPI, delPhotoAPI } from "@/apis/photoAPI";
import EditPhoto from "./EditPhoto";
import Masonry from 'react-masonry-css';
import styles from './style.module.css';
import LazyPhotoItem from '@/components/Photo/LazyPhotoItem';
import { clearAllPhotoAPI } from "@/apis/photoAPI";

const Photo: React.FC = () => {
  const [photoList, setPhotoList] = useState<Photo[]>([]);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null); // 当前正在编辑的照片
  const [isModalOpen, setIsModalOpen] = useState(false); // 控制模态框的开关
  const [searchParams] = useSearchParams(); // 获取相册ID
  const albumId = searchParams.get("albumId") as string;
  const userId = useSelector((state: RootState) => state.user).userId;
  const navigate = useNavigate();

  const fetchPhotos = async () => {
    const res = await getPhotoAPI(userId as string, albumId);
    setPhotoList(res.data.data);
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleDelete = async (photoId: string) => {
    Modal.confirm({
      title: '确认删除这张照片吗？',
      content: '删除后不可恢复',
      okText: '确认',
      cancelText: '取消',
      async onOk() {
        await delPhotoAPI(userId as string, photoId);
        message.success("删除成功");
        setPhotoList(photoList.filter((photo) => photo._id !== photoId));
      }
    })

  };

  const handleEditSuccess = async () => {
    setIsModalOpen(false);
    setEditingPhoto(null);
    await fetchPhotos(); // 更新列表数据
  };

  const handleClearAlbum = () => {
    let confirmValue = ""; // 用户输入的值
  
    Modal.confirm({
      title: '确认要清空整个相册吗？',
      content: (
        <div>
          <p>此操作不可恢复，请输入 <strong>清空相册</strong> 以确认：</p>
          <Input
            placeholder="请输入：清空相册"
            onChange={(e) => {
              confirmValue = e.target.value;
            }}
          />
        </div>
      ),
      okText: '确认清空',
      cancelText: '取消',
      async onOk() {
        if (confirmValue !== '清空相册') {
          message.error('输入错误，操作已取消');
          throw new Error('用户输入错误'); // 阻止确认关闭
        }
  
        await clearAllPhotoAPI(userId as string, albumId);
        setPhotoList([]);
        message.success('成功清空相册');
      }
    });
  };
  

  const breakpointColumnsObj = {
    default: 4,
    1200: 3,
    800: 2,
    // 500: 1
  };


  return (
    <>
      {photoList.length === 0 && <Empty
        image="/images/blank.png"
        styles={{ image: { height: 640, display: 'flex', justifyContent: 'center' } }}
        description={
          <Typography.Text style={{ fontSize: 16 }}>
            相册中还没有图片，赶紧来<a href="#" onClick={() => navigate(`/photo/addPhoto/${albumId}`)}>上传</a>吧
          </Typography.Text>
        }
      >
      </Empty>}


      {photoList.length > 0 && <div>
        <Flex gap="middle">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate(`/photo/addPhoto/${albumId}`)}
            className={styles['upload-button']}
          >
            上传图片
          </Button>

          <Tag color="#87d068" style={{ height: 32, lineHeight: '32px', display: 'flex', alignItems: 'center' }}>
            <i className='iconfont icon-xiangce' style={{ marginRight: 8 }}></i>
            共 {photoList.length} 张图片
          </Tag>

          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={handleClearAlbum}
          >
            清空相册
          </Button>
        </Flex>

        <Masonry
          breakpointCols={breakpointColumnsObj}
          className= {styles["masonry-grid"]}
          columnClassName= {styles["masonry-grid-column"]}
        >
          {photoList.map((item) => (

            <div key={item._id} style={{ marginBottom: 8 }}>
              <LazyPhotoItem
                photo={item}
                onEdit={() => {
                  setEditingPhoto(item);
                  setIsModalOpen(true);
                }}
                onDelete={() => handleDelete(item._id as string)}
              />
            </div>)
          )}
        </Masonry>

        {/* 只渲染一个编辑弹窗 */}
        {editingPhoto && (
          <EditPhoto
            photo={editingPhoto}
            isModalOpen={isModalOpen}
            setIsModalOpen={(open) => {
              setIsModalOpen(open);
              if (!open) setEditingPhoto(null);
            }}
            onSuccess={handleEditSuccess}
          />
        )}
      </div>}
    </>

  );
};

export default Photo;
