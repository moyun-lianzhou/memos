import React, { useState } from 'react';
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useLazyLoad } from '@/utils/photoLazyLoad';
import type { Photo } from '@/types/index';
import './LazyPhotoItem.css';
import PhotoPreviewModal from '@/components/Photo/PhotoPreviewModal';

interface Props {
  photo: Photo;
  onEdit: () => void;
  onDelete: () => void;
}

const LazyImageCard: React.FC<Props> = ({ photo, onEdit, onDelete }) => {
  const { imgRef, source, loaded, handleLoad } = useLazyLoad(photo.fileName);
  const [isModalVisible, setIsModalVisible] = useState(false); // 用于控制 Modal 的显示与隐藏
  const [modalImageUrl, setModalImageUrl] = useState<string>(''); // 存储点击图片的 URL
  // 处理点击图片事件
  const handleClick = () => {
    setModalImageUrl(source); // 设置图片的 URL
    setIsModalVisible(true); // 显示 Modal
  };

  return (
    <div
      className="image-wrapper"
      style={{
        aspectRatio: `${photo.width} / ${photo.height}`, // 设置占位比例
      }}
    >
      <div className="photo-card">
        {/* 占位图：当图片加载时隐藏 */}
        <img
          className={`photo-thumb ${loaded ? 'hidden' : ''}`}
          src={'/images/background.jpg'} // 使用固定的背景图作为占位图封面
          alt={photo.name}
        />

        {/* 懒加载高清图 */}
        <img
          ref={imgRef}
          src={source || undefined} // 透明图防止加载时出错
          alt={photo.name}
          onLoad={handleLoad}
          className={`photo-image ${loaded ? 'loaded' : ''}`}
          onClick={handleClick}
        />

        {/* 编辑和删除按钮 */}
        <div className="action-buttons">
          <EditOutlined className="action-icon" onClick={onEdit} />
          <DeleteOutlined className="action-icon" onClick={onDelete} />
        </div>
      </div>

      {/* 图片放大预览Modal组件 */}
      <PhotoPreviewModal
        photo = {photo}
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        modalImageUrl = {modalImageUrl}
      />
    </div>

  );
};

export default LazyImageCard;
