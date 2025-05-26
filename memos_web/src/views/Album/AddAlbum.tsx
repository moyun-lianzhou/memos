import React, { useEffect, useState } from 'react';
import type { FormProps, UploadFile } from 'antd';
import { App, Button, Form, Input, Select } from 'antd';
import UploadCover from '@/components/Upload/UploadAlbumCover'
import { addAlbumAPI } from '@/apis/albumAPI'
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { getAlbumTypeAPI } from '@/apis/albumAPI';

type FieldType = {
    name: string;
    cover: UploadFile[];
    type: string;
    desc: string;
    userId: string;
    [key: string]: any; // 添加索引签名，允许通过 string 键来访问
};

const AddAlbum: React.FC = () => {
    const user = useSelector((state: RootState) => state.user);
    const { message } = App.useApp();
    const navigate = useNavigate()
    const [albumType, setAlbumType] = useState<{ value: string; label: string; desc: string }[]>([])
    const [form] = Form.useForm();

    useEffect(() => {
        getAlbumType()
    }, [])

    const getAlbumType = async () => {
        const res = await getAlbumTypeAPI()
        const typeList = res.data.data
        const options = typeList.map((item: { name: string; desc: string }) => ({ value: item.name, label: item.name, desc: item.desc }))
        setAlbumType(options)

        // 自动设置默认类型对应的描述（比如 "普通"）
        const defaultType = '普通'
        const selected = options.find((item: { value: string, label: string, desc: string }) => item.value === defaultType)
        if (selected) {
            form.setFieldsValue({
                type: defaultType,
                desc: selected.desc
            })
        }
    }

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        const formData = new FormData()
        // 遍历 values，将普通字段和文件字段（如 cover）一起加入 FormData
        formData.append('userId', user.userId as string);
        for (const key in values) {
            if (key !== 'cover') formData.append(key, values[key]);
        }
        const fileObj = values['cover'][0].originFileObj;
        if (fileObj instanceof Blob) {
            formData.append('cover', fileObj);
        }
        addAlbum(formData)
    };

    const addAlbum = async (formData: FormData) => {
        await addAlbumAPI(formData)
        message.success('相册创建成功')
        navigate('/album', { replace: true })
    }

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const normFile = (e: any) => {
        console.log(e);
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const handleChange = (value: string) => {
        const selected = albumType.find(item => item.value === value);
        if (selected) {
            form.setFieldsValue({ desc: selected.desc });
        }
    };


    return (
        <div>
            <h2>新建相册</h2>
            <Form
                form={form}
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item<FieldType>
                    label="相册名称"
                    name="name"
                    rules={[{ required: true, message: '请输入相册名字!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType> // 让上传组件受From控制
                    label="相册封面"
                    name="cover"
                    valuePropName="fileList" // 会传给组件属性fileList和onChange
                    getValueFromEvent={normFile}
                    rules={[{ required: true, message: '请上传相册封面!' }]}>
                    <UploadCover />
                </Form.Item>

                <Form.Item<FieldType>
                    label="相册类型"
                    name="type"
                >
                    <Select
                        style={{ width: 120 }}
                        onChange={handleChange}
                        options={albumType}
                    />
                </Form.Item>

                <Form.Item<FieldType>
                    label="相册描述"
                    name="desc"
                    rules={[{ required: true, message: '请输入相册描述!' }]}
                >
                    <Input.TextArea />
                </Form.Item>

                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit">
                        新建相册
                    </Button>
                </Form.Item>
            </Form>

        </div>
    )
}

export default AddAlbum;