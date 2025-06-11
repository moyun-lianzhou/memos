import { Button, Card, Tag, Tooltip } from "antd";
import React from "react";
import { DeleteOutlined, EditOutlined, FileAddOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router";
import dayjs from 'dayjs';
import type { Album } from '@/types/index';
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

interface AlbumCardProps {
    item: Album;
    showDelConfirm: (albumName: string, albumId: string) => void; // 显示删除确认框的回调函数
}

const AlbumCard: React.FC<AlbumCardProps> = ({ item, showDelConfirm }) => {
    const navigate = useNavigate();

    const { theme } = useSelector((state: RootState) => state.theme);

    return (
        <div className={`${theme} border-1 ${theme === 'dark' ? 'border-gray-500' : 'border-gray-200'}  rounded-2xl overflow-hidden`}>
            <div className="cursor-pointer h-88 hover:bg-[#F3F4F6] dark:hover:bg-[#111828]">
                {/* 图片 */}
                <div className="relative h-60 group overflow-hidden" onClick={() => navigate(`/photo?albumId=${item._id}`)}>
                    <img
                        src={item.cover}
                        alt={item.name}
                        className="mx-auto w-full h-full object-cover transition origin-center group-hover:scale-103 duration-300 ease-in-out"
                    />
                    
                    <div className="absolute left-6 bottom-1">
                        <span className="text-white text-lg font-bold duration-300">{item.name} </span>
                        {item.type !== '普通' && (<Tag color="geekblue" style={{ marginLeft: 8 }}>{item.type}</Tag>)}
                    </div>
                    {/* <div className="absolute right-0 top-0">
                        <span>{item.name}</span>
                    </div> */}
                </div>
                {/* 信息 */}
                <div className="flex flex-col">
                    <span className="py-4 px-4 text-sm leading-6">{item.desc}</span>
                    <span className="px-4 text-xs text-gray-500">创建于 {dayjs(item.createdAt).format('YYYY-MM-DD')}</span>
                </div>

            </div>
        </div>

    );
};

export default AlbumCard;
