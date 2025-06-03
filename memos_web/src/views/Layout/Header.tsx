import { Menu, PopconfirmProps, theme, Layout, Popconfirm, Switch, Button, App } from "antd"
import { NavLink, useLocation, useNavigate } from "react-router";
import { logout } from '@/redux/slices/userSlice';
import { RootState } from '@/redux/store';
import { useSelector, useDispatch } from 'react-redux';
import {getUserInfoAPI} from '@/apis/userAPI';
import { useEffect, useState } from "react";

interface HeaderProps {
    isDarkMode: boolean;
    setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const HeaderBar: React.FC<HeaderProps> = ({ isDarkMode, setIsDarkMode }) => {
    const { token } = theme.useToken();
    const { Header } = Layout;
    const items = [
        {
            key: 'home',
            label: <NavLink to="/">首页</NavLink>
        },
        {
            key: 'album',
            label: <NavLink to="/album">相册</NavLink>
        },
        {
            key: 'article',
            label: <NavLink to="/article">记忆创作</NavLink>
        }
    ];

    const navigate = useNavigate()
    const location = useLocation(); // 获取当前路径
    const user = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();
    const {message} = App.useApp()
    const [nickName, setNickName] = useState('')

    useEffect(()=>{
        getUserInfo(user?.userId as string) 
    }, [])

    const getUserInfo = async (userId: string)=>{
        const res = await getUserInfoAPI(userId as string)
        setNickName(res.data.data.nickname)
    }

    // 获取当前路径来确定哪个菜单项选中
    const getSelectedKey = () => {
        if (location.pathname.startsWith('/album')) return 'album';
        if (location.pathname.startsWith('/article')) return 'article';
        return 'home';
    };

    const confirm: PopconfirmProps['onConfirm'] = () => {
        dispatch(logout());
        navigate('/login');
        message.success('成功退出登录');
    };
    return (
        <Header
            style={{
                padding:'0 240px',
                background: token.colorBgElevated, // 修正 Header 适配暗黑模式
            }}
            className="flex items-center"
        >
            <Menu
                theme={isDarkMode ? 'dark' : 'light'}
                mode="horizontal"
                selectedKeys={[getSelectedKey()]}
                items={items}
                style={{background: token.colorBgElevated}} // 确保 Menu 颜色一致
                className="flex-1 min-w-0"
            />
            <span>欢迎，{nickName}</span>
            <Popconfirm title="确认退出登录吗？" onConfirm={confirm} okText="确认" cancelText="取消" >
                <Button type="link">退出登录</Button>
            </Popconfirm>

            <div>
                <Switch
                    checked={!isDarkMode}
                    onChange={() => setIsDarkMode(!isDarkMode)}
                    checkedChildren="🌙"
                    unCheckedChildren="☀️"
                />
            </div>
        </Header>
    )

}

export default HeaderBar