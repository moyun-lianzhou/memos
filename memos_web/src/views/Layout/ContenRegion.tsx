import React from "react";
import { GlobalToken, Layout } from "antd";
const { Content } = Layout;
import { Outlet } from "react-router";
import { inherits } from "echarts/types/src/export/api/util.js";

interface TokenProps {
  collapsed: boolean;
  token: GlobalToken;
}

const ContentRegion: React.FC<TokenProps> = ({collapsed, token}) => {
  return (
    <>
      <Content
      className="pt-1 fixed  right-0 top-[64px]" 
      style={{
        overflow:'auto', 
        left: collapsed ? 80 : 256,
        transition: 'left 0.3s ease', 
        minHeight: "calc(100vh - 64px)",
        background: token.colorBgBase, // 确保背景颜色正确继承自 token 或其他样式
      }}>
        {/* 主内容区 */}
        <div
          style={{
            height: "calc(100vh - 64px)",
          }}
          className="pt-4 ml-1"
        >
          <Outlet />
        </div>
      </Content>
    </>
  );
};

export default ContentRegion;
