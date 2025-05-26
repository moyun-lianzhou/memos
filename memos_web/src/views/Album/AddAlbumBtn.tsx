import React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Card } from 'antd';
// import './AddAlbum.css'
import { NavLink } from 'react-router';


const AddAlbumBtn: React.FC = () => {
    return (
        <div>
            <NavLink to="addAlbum">
                <Card
                    hoverable
                    style={{ width: 300, textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}
                >
                    <PlusOutlined style={{ fontSize: 40, color: '#1890ff' }} />
                    <p style={{ marginTop: 10, color: '#1890ff', fontSize: 16 }}>添加相册</p>

                </Card>
            </NavLink>
        </div >

    )
}

export default AddAlbumBtn;