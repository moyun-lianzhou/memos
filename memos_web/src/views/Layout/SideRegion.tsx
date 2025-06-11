import {
  HighlightOutlined,
  PictureOutlined,
  SettingOutlined,
  StarOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { GlobalToken, Layout, Menu } from "antd";
import { useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router";

const selectItems = [
  { key: "home", icon: <PictureOutlined />, label: <NavLink to="/">照片</NavLink> },
  { key: "album", icon: <span className="iconfont icon-xiangce1" />, label: <NavLink to="/album">相册</NavLink> },
  { key: "memory", icon: <HighlightOutlined />, label: <NavLink to="/article">记忆</NavLink> },
  { key: "collection", icon: <StarOutlined />, label: <NavLink to="/collection">收藏夹</NavLink> },
  { key: "photowall", icon: <StarOutlined />, label: <NavLink to="/photowall">照片墙</NavLink> },
  { key: "my", icon: <UploadOutlined />, label: <NavLink to="/my">我的</NavLink> },
  { key: "setting", icon: <SettingOutlined />, label: <NavLink to="/setting">设置</NavLink> },
];

const { Sider } = Layout;

interface ThemeWrapperProps {
  token: GlobalToken;
  isDarkMode: boolean;
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  toggleButtonRef: React.RefObject<HTMLButtonElement | null>;
}

const SideRegion: React.FC<ThemeWrapperProps> = ({ token, isDarkMode, collapsed, setCollapsed, toggleButtonRef }) => {
  const sideRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // 根据屏幕大小设置侧边栏收缩状态
  useEffect(() => {
    setCollapsed(window.innerWidth < 768); // 页面渲染时根据屏幕大小设置初始状态
    const handleResize = () => {
        setCollapsed(window.innerWidth < 768); 
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  // 点击侧边栏以外区域收起侧边栏 
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        window.innerWidth < 768 &&
        sideRef.current &&
        toggleButtonRef.current &&
        !sideRef.current.contains(e.target as Node) &&
        !toggleButtonRef.current.contains(e.target as Node)
      ) {
        setCollapsed(true);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setCollapsed, toggleButtonRef]);

  // 根据当前路由路径返回选中的菜单键名，用于设置菜单的选中状态。
  const getSelectedKey = () => {
    console.log(location.pathname)
    if (location.pathname.startsWith("/album")) return "album";
    if (location.pathname.startsWith("/article")) return "memory";
    return "null";
  };

  return (
    <div
      ref={sideRef}
      className={`fixed top-[64px] left-0 z-40 h-[calc(100vh-64px)] w-[256px] transform transition-transform duration-300 ease-in-out
        ${!collapsed ? "translate-x-0" : "-translate-x-full"}`}
    >

      <Sider trigger={null}>
        <Menu
          style={{
            borderRight: '1px solid',
            borderColor: token.colorBorder,
            background: token.colorBgBase,
            width: '256px',
          }}
          className="h-[calc(100vh-64px)]"
          mode="inline"
          theme={isDarkMode ? 'dark' : 'light'}
          selectedKeys={[getSelectedKey()]}
          defaultSelectedKeys={["album"]}
          items={selectItems}
        />
      </Sider>
    </div>
  );
};

export default SideRegion;
