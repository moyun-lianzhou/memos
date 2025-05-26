
import { App } from 'antd';
import React from 'react';
import { Outlet } from 'react-router';

const Photo: React.FC = () => {
  return (
    <App>
      <Outlet />
    </App>
  );
}

export default Photo;
