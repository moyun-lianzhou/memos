
import { App } from 'antd';
import React from 'react';
import { Outlet } from 'react-router';

const Album: React.FC = () => {
  return (
    <App>
      <Outlet />
    </App>
  );
}

export default Album;
