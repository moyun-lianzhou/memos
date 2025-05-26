import React from 'react';
import Layout from '@/views/Layout/index'
import Login from '@/views/Login/index'
import Register from '@/views/Rigister/index'
import { Route, Routes } from 'react-router';
import Album from '@/views/Album';
import AddAlbum from '@/views/Album/AddAlbum';
import Photo from '@/views/Photo';
import Home from '@/views/Home';
import AlbumList from '@/views/Album/AlbumList';
import EditAlbum from '@/views/Album/EditAlbum';
import Upload from '@/components/Upload/index';
import RequireAuth from '@/components/Auth/RequireAuth';
import RedirectIfAuthenticated from '@/components/Auth/RedirectIfAuthenticated';
import PhotoList from '@/views/Photo/PhotoList';
import AddPhoto from '@/views/Photo/AddPhoto';


const APP: React.FC = () => {
  return (
    <div>
      <Routes>

        {/* 需要登录才能访问的页面 */}
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            {/* 嵌套路由 */}
            <Route path="album" element={<Album />}>
              <Route index element={<AlbumList />} />
              <Route path="addAlbum" element={<AddAlbum />} />
              <Route path="editAlbum/:_id" element={<EditAlbum />} />
              
            </Route>
            <Route path="photo" element={<Photo />} >
              <Route index element={<PhotoList />} />
              <Route path="addPhoto/:albumId" element={<AddPhoto />} />
            </Route>
          </Route>
          <Route path="/upload" element={<Upload />} />
        </Route>

        {/* 已登录用户不能访问登录页面 */}
        <Route element={<RedirectIfAuthenticated />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* 其他公共页面 */}
      </Routes>
    </div>
  );
}

export default APP
