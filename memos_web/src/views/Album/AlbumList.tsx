import React, { useState, useEffect } from 'react';
import { Button, Tag} from 'antd';
import { getAlbumAPI, delAlbumAPI } from '../../apis/albumAPI';
import type { Album } from '@/types/index';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { App } from 'antd';
import AlbumCard from '@/components/Album/AlbumCard';

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

  return (
    <div>
      {/* 按钮行 */}
      <div className='flex'>
        <Button type="primary" onClick={() => navigate('addAlbum')} className='mb-4 mr-2'>新建相册</Button>
        <Tag color="#87d068" style={{ height: 32, lineHeight: '32px', display: 'flex', alignItems: 'center' }}>
          <svg className="w-5 h-5 mr-1" aria-hidden="true"><use xlinkHref="#icon-xiangce"></use></svg>
          <span>共 {albumList.length} 张相册</span>
        </Tag>
      </div>
      {/* 相册列表 */}
      <div className='grid gap-4 grid-cols-[repeat(auto-fill,minmax(18rem,1fr))]'>
        {albumList.map((item) => (
            <AlbumCard item={item} showDelConfirm={showDelConfirm}/>
        ))}
      </div>
    </div>
  );
};

export default Album;
