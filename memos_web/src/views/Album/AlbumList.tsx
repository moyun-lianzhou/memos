import React, { useState, useEffect } from 'react';
import { Button, Card, Tag, Tooltip, Flex } from 'antd';
import { getAlbumAPI, delAlbumAPI } from '../../apis/albumAPI';
import type { Album } from '@/types/index';
import { DeleteOutlined, EditOutlined, FileAddOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import dayjs from 'dayjs';
import { App } from 'antd';

const Album: React.FC = () => {
  const { message, modal } = App.useApp();
  const [albumList, setAlbumList] = useState<Album[]>([]);
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    (async () => {
      if (user.userId) {
        const res = await getAlbumAPI(user.userId as string);
        setAlbumList(res.data.data);
      }
    })();
  }, []);

  const handleDel = async (_id: string) => {
    await delAlbumAPI(_id);
    setAlbumList(albumList.filter((album) => album._id !== _id));
    message.success('删除成功');
  };

  const showDelConfirm = (name: string, _id: string) => {
    modal.confirm({
      title: `确认删除相册「${name}」吗?`,
      icon: <ExclamationCircleFilled />,
      content: '删除后不可恢复，请确认相册中已没有照片！',
      okText: '删除',
      cancelText: '取消',
      onOk: () => handleDel(_id),
    });
  };

  const handleClickCard = (albumId: string) => {
    navigate(`/photo?albumId=${albumId}`);
  };

  return (
    <div className='pl-4'>

      <Flex gap="middle">
        <Button
          type="primary"
          onClick={() => navigate('addAlbum')}
          style={{marginBottom: 16}}
        >
          新建相册
        </Button>

        <Tag color="#87d068" style={{ height: 32, lineHeight: '32px', display: 'flex', alignItems: 'center' }}>
          <i className='iconfont icon-xiangce' style={{ marginRight: 8 }}></i>
          共 {albumList.length} 张相册
        </Tag>
      </Flex>

      {/* 相册列表 */}
      <Flex wrap gap="large" justify="start">
        {albumList.map((item) => (
          <Card
            key={item._id}
            hoverable
            style={{
              width: 296,
              height: 360,
              borderRadius: 16,
              overflow: 'hidden',
              boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
              color: '#ddd',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
            cover={
              <div
                style={{
                  height: 200,
                  overflow: 'hidden',
                  position: 'relative',
                }}
                onClick={() => handleClickCard(item._id as string)}
              >
                <img
                  src={item.cover}
                  alt={item.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                    padding: '10px 16px',
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}
                >
                  {item.name}
                  {item.type !== '普通' && (
                    <Tag color="geekblue" style={{ marginLeft: 8 }}>
                      {item.type}
                    </Tag>
                  )}
                </div>
              </div>
            }
            actions={[
              <Tooltip title="上传照片" key="upload">
                <Button
                  shape="circle"
                  icon={<FileAddOutlined />}
                  onClick={() => navigate(`/photo/addPhoto/${item._id}`)}
                />
              </Tooltip>,
              <Tooltip title="编辑相册" key="edit">
                <Button
                  shape="circle"
                  icon={<EditOutlined />}
                  onClick={() => navigate(`/album/editAlbum/${item._id}`)}
                />
              </Tooltip>,
              <Tooltip title="删除相册" key="delete">
                <Button
                  shape="circle"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => showDelConfirm(item.name, item._id as string)}
                />
              </Tooltip>,
            ]}
          >
            <div>
              <div style={{ color: '#aaa', marginBottom: 8 }}>{item.desc}</div>
              <div style={{ fontSize: 12, color: '#666' }}>
                创建于 {dayjs(item.createdAt).format('YYYY-MM-DD')}
              </div>
            </div>
          </Card>
        ))}
      </Flex>
    </div>
  );
};

export default Album;
