import { theme, Layout, Switch, Button, Popover, } from "antd";
import { useLocation, useNavigate } from "react-router";
import { logout } from "@/redux/slices/userSlice";
import { RootState } from "@/redux/store";
import { useSelector, useDispatch } from "react-redux";
import { getUserInfoAPI } from "@/apis/userAPI";
import { useEffect, useState } from "react";
import { SettingOutlined, ToolOutlined, UnorderedListOutlined, UploadOutlined, } from "@ant-design/icons";

interface HeaderProps {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  toggleButtonRef: React.RefObject<HTMLButtonElement | null>; // 添加 ref 类型
}

const HeaderRegion: React.FC<HeaderProps> = ({ isDarkMode, setIsDarkMode, setCollapsed, toggleButtonRef }) => {
  const { token } = theme.useToken();
  const { Header } = Layout;

  const navigate = useNavigate();
  const location = useLocation();
  const selectKey = location.pathname.split("/")[1];
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const [nickName, setNickName] = useState("");
  const [showSiteTitle, setshowSiteTitle] = useState(window.innerWidth >= 768);

  useEffect(() => {
    getUserInfo(user?.userId as string);
  }, []);

  useEffect(() => {
    const handleResize = () => setshowSiteTitle(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getUserInfo = async (userId: string) => {
    const res = await getUserInfoAPI(userId);
    setNickName(res.data.data.nickname);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleClickAvatar = () => {
    console.log("点击头像");
  };

  return (
    <Header
      style={{ background: token.colorBgBase, borderColor: token.colorBorder, padding: "0 0", }}
      className="flex items-center justify-between fixed inset-0 border-b border-gray-100"
    >
      <div className="h-[63px] transiton duration-500 ease-in-out flex justify-between items-center"
        style={{ background: token.colorBgBase, color: token.colorTextBase }}
      >
        <div className={`flex transition-transform duration-300 ease-in-out ${showSiteTitle ? "translate-x-0" : "-translate-x-50"}`}>
          <img src="https://picsum.photos/200/200" className="cursor-pointer ml-6 w-8 h-8 inline rounded" />
          <div className="px-2 text-2xl font-mono">memory</div>
        </div>

        {!showSiteTitle && (
          <Button
            ref={toggleButtonRef}
            type="text"
            className="transition-transform duration-300 ease-in-out -translate-x-30"
            icon={<UnorderedListOutlined />}
            onClick={() => setCollapsed(prev => !prev)}
            style={{ fontSize: "16px", width: 32, height: 32, marginRight: 16 }}
          />
        )}
      </div>

      <div className="flex items-center mr-6">
        {selectKey === "album" && (
          <div className="text-[#a0a0a0] py-2 px-2 rounded-xl cursor-pointer w-24 hover:bg-[#e0e0e0] text-center text-base">
            <UploadOutlined />
            上传
          </div>
        )}
        <div className="pr-6 ml-4">
          <Switch
            checked={!isDarkMode}
            onChange={() => setIsDarkMode(!isDarkMode)}
            checkedChildren="🌙"
            unCheckedChildren="☀️"
          />
        </div>

        <div className="cursor-pointer" onClick={handleClickAvatar}>
          <Popover trigger="click" placement="bottomRight" arrow={false}
            content={
              <div className="w-32 flex flex-col items-center mx-12">
                <svg className="w-16 h-16 rounded-full" aria-hidden="true">
                  <use xlinkHref="#icon-dongwutouxiang-04" />
                </svg>
                <span className="mt-2 text-base text-[#4352ad] font-serif font-bold">{nickName}</span>
                <button className="mt-4 mb-2 px-4 py-1.5 rounded-3xl border border-gray-300 text-gray-500 hover:bg-gray-100">
                  <i><SettingOutlined /></i>
                  <span className="ml-2">账户设置</span>
                </button>
                <button className="mb-2 px-4 py-1.5 rounded-3xl border border-gray-300 text-gray-500 hover:bg-gray-100">
                  <i><ToolOutlined /></i>
                  <span className="ml-2">系统设置</span>
                </button>
                <span onClick={handleLogout} className="mt-2 text-sm text-blue-500 cursor-pointer hover:text-blue-400">退出登录</span>
                <span className="mt-2 text-xs underline text-blue-500 cursor-pointer hover:text-blue-400">支持和反馈</span>
              </div>
            }>
              {/* 头像 */}
            <svg className="w-12 h-12 rounded-full border-gray-400 hover:border-gray-200 hover:border" aria-hidden="true">
              <use xlinkHref="#icon-dongwutouxiang-04" />
            </svg>
          </Popover>
        </div>
      </div>
    </Header>
  );
};

export default HeaderRegion;
