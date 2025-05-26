import React from 'react';
import { Modal, Flex, Typography, Divider } from 'antd';
import type { Photo } from '@/types/index';
import dayjs from 'dayjs';
import './PhotoPreviewModal.css'; // 创建单独的样式文件

const { Text, Title } = Typography;

interface Props {
    photo: Photo;
    isModalVisible: boolean;
    setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    modalImageUrl: string;
}

const PhotoPreviewModal: React.FC<Props> = ({ photo, isModalVisible, setIsModalVisible, modalImageUrl }) => {
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <Modal
            open={isModalVisible}
            onCancel={handleCancel}
            footer={null}
            width="70%"
            centered
            className="photo-preview-modal"
        >
            <Flex gap="large" className="modal-content">
                <div className="image-container">
                    <img
                        src={modalImageUrl}
                        alt={photo.name || 'Full Size'}
                        className="preview-image"
                    />
                </div>
                
                <div className="metadata-container">
                    <Title level={4} className="photo-title">{photo.name}</Title>
                    <Divider />
                    
                    <Flex vertical gap="middle">
                        <div className="metadata-item">
                            <Text strong>拍摄时间:</Text>
                            <Text>{photo.shootTime ? dayjs(photo.shootTime).format('YYYY-MM-DD HH:mm') : '未记录'}</Text>
                        </div>
                        
                        <div className="metadata-item">
                            <Text strong>上传时间:</Text>
                            <Text>{dayjs(photo.uploadedAt).format('YYYY-MM-DD HH:mm')}</Text>
                        </div>
                        
                        <div className="metadata-item">
                            <Text strong>照片尺寸:</Text>
                            <Text>{photo.width} × {photo.height} 像素</Text>
                        </div>
                        
                        {photo.desc && (
                            <div className="metadata-item">
                                <Text strong>照片描述:</Text>
                                <Text className="photo-description">{photo.desc}</Text>
                            </div>
                        )}
                    </Flex>
                </div>
            </Flex>
        </Modal>
    );
};

export default PhotoPreviewModal;