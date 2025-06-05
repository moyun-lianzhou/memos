import React from "react";
import { GlobalToken, Layout } from "antd";
const { Footer } = Layout;

interface TokenProps {
  token: GlobalToken;
}

export const FooterRegion: React.FC<TokenProps> = ({ token }) => {
  return (
    <Footer
      style={{ background: token.colorBgBase }}
      className="text-center"
    >
      © 2025 Moyunlianzhou — Made with passion & purpose
    </Footer>
  );
};

export default FooterRegion;
