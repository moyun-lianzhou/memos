import React, { useState } from "react";
import { theme, ConfigProvider } from "antd";
import ThemeWrapper from "./ThemeWrapper";
import { App } from "antd";

const Layout: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <App>
      <ConfigProvider
        theme={{
          algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: {
            borderRadius: 8, // 圆角
          },
          components: {
            Layout: {},
          },
        }}
      >
        {/* useToken 必须在 ConfigProvider 作用域内 */}
        <ThemeWrapper isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      </ConfigProvider>
    </App>
  );
};

export default Layout;
