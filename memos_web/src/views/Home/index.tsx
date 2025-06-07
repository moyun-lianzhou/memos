import ImageCard from '@/components/Photo/ImageCard';
import React from "react";


const Home: React.FC = () => {
    const photoList = [
        {
            id: '1',
            url: `https://picsum.photos/400/300/?id=${Math.random()}`,
            description: '这是一张美丽的风景照片',
            time: '2024-01-01',
            detail:{
                size: '1.7MB',
                pixel: '1920x1080',
                model: '佳能EOS 1000D',
                location: '北京',
                tags: ['旅行', '风景'],
                ifColection: true,
            },
        },
        {
            id: '2',
            url: `https://picsum.photos/200/300/?id=${Math.random()}`,
            description: '这是一张美丽的风景照片',
            time: '2024-01-01',
            detail:{
                size: '1.7MB',
                pixel: '1920x1080',
                model: '佳能EOS 1000D',
                location: '北京',
                tags: ['旅行', '风景'],
                ifColection: true,
            },
        },
        {
            id: '3',
            url: `https://picsum.photos/400/300/?id=${Math.random()}`,
            description: '这是一张美丽的风景照片',
            time: '2024-01-01',
            detail:{
                size: '1.7MB',
                pixel: '1920x1080',
                model: '佳能EOS 1000D',
                location: '北京',
                tags: ['旅行', '风景'],
                ifColection: true,
            },
        },
        {
            id: '4',
            url: `https://picsum.photos/400/300/?id=${Math.random()}`,
            description: '这是一张美丽的风景照片',
            time: '2024-01-01',
            detail:{
                size: '1.7MB',
                pixel: '1920x1080',
                model: '佳能EOS 1000D',
                location: '北京',
                tags: ['旅行', '风景'],
                ifColection: true,
            },
        },
        {
            id: '5',
            url: `https://picsum.photos/400/300/?id=${Math.random()}`,
            description: '这是一张美丽的风景照片',
            time: '2024-01-01',
            detail:{
                size: '1.7MB',
                pixel: '1920x1080',
                model: '佳能EOS 1000D',
                location: '北京',
                tags: ['旅行', '风景'],
                ifColection: true,
            },
        },
        {
            id: '6',
            url: `https://picsum.photos/300/300/?id=${Math.random()}`,
            description: '这是一张美丽的风景照片',
            time: '2024-04-26',
            detail:{
                size: '3.7MB',
                pixel: '3920x2280',
                model: '佳能EOS 1000D',
                location: '西藏',
                tags: ['旅行', '风景'],
                ifColection: false,
            },
        }
    ]

    // 初始化选中的照片 ID 数组为空
    const [selectedPhotos, setSelectedPhotos] = React.useState<string[]>([]);

    const handleSelect = (id:string, isSelected:boolean) => {
        setSelectedPhotos(isSelected ? [...selectedPhotos, id] : selectedPhotos.filter(photoId => photoId !== id)); // 切换选中状态，添加或移除 ID 从数组中
        console.log(`Image ${id} is selected`)
    };

    return (
        <div>
            <h1>已选中{selectedPhotos.length}个项目</h1>
            <div className="flex flex-wrap">
            {photoList.map((photo) => {
                return (
                    <div className="" key={photo.id}>
                        <p className="ms-2.5 text-lg py-4">{photo.time}</p>
                        <div className="cursor-pointer relative">
                            {/* <i className="absolute left-1 top-1"><CheckCircleFilled /></i> */}
                            {/* <img src={photo.url}></img> */}
                            <ImageCard
                            src={photo.url}
                            alt="风景照片" 
                            id={photo.id}
                            onSelect={handleSelect}
                            />
                        </div>
                        
                        {/* <p>{photo.description}</p>
                        <p>{photo.detail.size}</p>
                        <p>{photo.detail.pixel}</p>
                        <p>{photo.detail.model}</p>
                        <p>{photo.detail.location}</p>
                        <p>{photo.detail.tags}</p>
                        <p>{photo.detail.ifColection}</p> */}
                    </div>
                )
            })}
            </div>

        </div>
    )
}

export default Home;