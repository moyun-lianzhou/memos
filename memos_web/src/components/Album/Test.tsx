import { Button, Card, Tag, Tooltip } from "antd";
import React from "react";
import { DeleteOutlined, EditOutlined, FileAddOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router";
import dayjs from 'dayjs';
import type { Album } from '@/types/index';

interface AlbumCardProps {
    item: Album;
    showDelConfirm: (albumName: string, albumId: string) => void; // 显示删除确认框的回调函数
}

const AlbumCard: React.FC<AlbumCardProps> = ({ item, showDelConfirm }) => {
    const navigate = useNavigate();

    return (
        <div>
            <Card
                key={item._id}
                hoverable
                style={{
                    // flexGrow: 1, 
                    flexBasis: 'calc(25% - 1rem)', // 一行最多 4 个卡片（含 gap）
                    minWidth: 296,
                    height: 360,
                    borderRadius: 16,
                    overflow: 'hidden',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                    color: '#ddd',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    // background: `/images/album_background.png repeat`,
                }}
                cover={
                    <div
                        style={{
                            height: 200,
                            overflow: 'hidden',
                            position: 'relative',
                        }}
                        onClick={() => navigate(`/photo?albumId=${item._id}`)}
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
        </div>
    );
};

export default AlbumCard;
