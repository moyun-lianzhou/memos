import React from "react";
import { GlobalToken, Layout } from "antd";
const { Content } = Layout;
import { Outlet } from "react-router";

interface TokenProps {
  token: GlobalToken;
}

const ContentRegion: React.FC<TokenProps> = ({ token }) => {
  return (
    <>
      <Content
        className="overflow-auto fixed right-0 top-[64px] left-0 md:left-[256px] transition-all duration-300 ease-in-out"
        style={{
          height: "calc(100vh - 64px)",
          background: token.colorBgBase, // 确保背景颜色正确继承自 token 或其他样式
        }}>
        {/* 主内容区 */}
        <div className="pt-4 pb-8 px-4 min-h-[calc(100vh-64px)]">
          <Outlet />
        </div>
      </Content>
    </>
  );
};

export default ContentRegion;
