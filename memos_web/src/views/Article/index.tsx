import { App } from 'antd';
import React from 'react';
import { Outlet } from 'react-router';

const Article: React.FC = () => {
  return (
    <App>
      <Outlet />
    </App>
  );
}

export default Article;
