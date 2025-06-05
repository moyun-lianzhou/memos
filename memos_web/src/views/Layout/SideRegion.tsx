import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Button, GlobalToken, Layout, Menu} from "antd";
import { NavLink } from "react-router";

const { Sider } = Layout;

interface ThemeWrapperProps {
  token: GlobalToken;
  isDarkMode: boolean;
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const selectItems = [
  {
    key: "1",
    icon: <UserOutlined />,
    label: <NavLink to="/album">相册</NavLink>,
  },
  {
    key: "2",
    icon: <VideoCameraOutlined />,
    label: <NavLink to="/article">记忆创作</NavLink>,
  },
  {
    key: "3",
    icon: <UploadOutlined />,
    label: <NavLink to="/article">设置</NavLink>,
  },
]

const SideRegion: React.FC<ThemeWrapperProps> = ({
  token,
  isDarkMode,
  collapsed,
  setCollapsed,
}) => {

  // 计算侧边栏宽度
  const siderWidth = collapsed ? 80 : 256;


  return (
    <div className="">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={siderWidth}
        style={{ 
          background: token.colorBgElevated,
          position: 'fixed', // 添加固定定位
          height: '100vh', // 设置高度为视口高度
          top: 0, // 距离顶部为 0
          left: 0, // 距离左侧为 0
        }}
      >
          <div style={{background:token.colorBgBase,color:token.colorTextBase}} 
          className="h-[64px] flex justify-between items-center">
            <div className="flex">
              <img
              onClick={() => setCollapsed(!collapsed)} 
              src="https://picsum.photos/200/200" 
              className="cursor-pointer ml-6 w-8 h-8 inline rounded"></img>
               {/* 只在非收缩状态显示标题 */}
            {!collapsed && <div className="px-2 text-2xl font-mono">memory</div>}
            </div>
            {!collapsed && 
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 32,
                height: 32,
                marginRight: 16
              }}
            />}
        </div>

        <Menu
          style={{borderRight:'1px solid',borderColor:token.colorBorder,background:token.colorBgBase,width: siderWidth,height:'calc(100vh - 64px)'}}
          mode="inline"
          theme={isDarkMode? 'dark' : 'light'}
          defaultSelectedKeys={["1"]}
          items={selectItems}
        />
      </Sider>
    </div>
  );
};

export default SideRegion;
