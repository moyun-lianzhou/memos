import React, { useEffect, useState } from 'react';
import type { FormProps, UploadFile } from 'antd';
import { App, Button, Form, Input, Select, Upload } from 'antd';
import UploadCover from '@/components/Upload/UploadAlbumCover'
import { editAlbumAPI, getAlbumDetailAPI, getAlbumTypeAPI } from '@/apis/albumAPI'
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';



type FieldType = {
    name?: string;
    cover?: UploadFile[];
    type?: string;
    desc?: string;
    userId?: string;
    raw_cover_name?: string;
    [key: string]: any; // 添加索引签名，允许通过 string 键来访问
};


const EditAlbum: React.FC = () => {
    const user = useSelector((state: RootState) => state.user);
    const { _id } = useParams(); // 获取 URL 里的 albumId
    const [form] = Form.useForm(); // 让 Form 受控
    const [showUpload, setShowUpload] = useState(false)
    const navigate = useNavigate()
    const { message } = App.useApp();
    let [rawCoverName, setRawCoverName] = useState('false')
    const [albumType, setAlbumType] = useState<{ value: string; label: string; desc: string }[]>([])

    useEffect(() => {
        getAlbumType()
        getAlbumDetail();
    }, [_id]);

    const getAlbumDetail = async () => {
        const res = await getAlbumDetailAPI(_id as string)
        if (res?.data?.data) {
            const albumData = res.data.data;
            // 处理 cover 字段，拼接 URL
            const fileList: UploadFile[] = albumData.cover
                ? [{
                    uid: '-1',
                    name: albumData.cover,
                    status: 'done',
                    url: albumData.cover, // 拼接完整 URL
                }] : [];
            setRawCoverName(albumData.cover.split('/').pop())
            form.setFieldsValue({ ...albumData, cover: fileList }); // 动态填充表单
        }
    }

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
        formData.append('_id', _id as string);
        formData.append('raw_cover_name', rawCoverName);

        for (const key in values) {
            if (key !== 'cover') formData.append(key, values[key]);
        }
        // 将文件写在最后面，防止multer先读取文件字段，忽略普通字段报错
        const fileObj = values['cover']?.[0].originFileObj;
        if (fileObj instanceof Blob) {
            formData.append('cover', fileObj);
        }
        editAlbum(formData)
    };


    const editAlbum = async (formData: FormData) => {
        await editAlbumAPI(formData)
        message.success('编辑成功')
        navigate('/album')
    }

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const normFile = (e: any) => {
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

    const handleRemove = () => {
        setShowUpload(true)
    }


    return (
        <div>
            <h2>编辑相册</h2>
            <Form
                form={form}
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                // initialValues={{ desc: '记录美好回忆', type: '普通' }}
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

                    {showUpload && <UploadCover />}
                    {!showUpload && <Upload
                        listType="picture-card"
                        onRemove={handleRemove}></Upload>}

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
                        编辑相册
                    </Button>
                </Form.Item>
            </Form>

        </div>
    )
}

export default EditAlbum;