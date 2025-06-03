import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { App, Image, Upload } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import {getBase64} from '@/utils/fileGetBase64'

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

interface UploadCoverProps extends UploadProps {
    fileList?: []; // 用于 Form 绑定值
    onChange?: (fileList: any) => void; // 用于 Form 触发更新
}

const UploadAlbumCover: React.FC<UploadCoverProps> = ({fileList = [], onChange = ()=>{}}) => {
    const { message } = App.useApp()
    const [previewOpen, setPreviewOpen] = useState(false); 
    const [previewImage, setPreviewImage] = useState(''); 
    /**
     * 处理图片预览事件的回调
     * @param file 
     */
    const handlePreview = async (file: UploadFile) => {
        // 如果文件没有 url 或 preview 属性，调用 getBase64 函数将文件转换为 Base64 编码字符串
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }
        // 设置 previewImage 为文件的 url 或 preview，并将 previewOpen 设置为 true，打开预览窗口
        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };


    const handleChange: UploadProps['onChange'] = (info) => {
        onChange(info.fileList); // 让 Form 监听到 fileList 变化
    };

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    return (
        <>
            <Upload
                beforeUpload={(file) => {
                    const isImage = (file.type === 'image/png' || file.type === 'image/jpeg') ? true : false
                    const isLt5M = file.size / 1024 / 1024 < 10;
                    if (!isImage) {
                        message.error("只能上传 png 或 jpg 图片格式！");
                        return Upload.LIST_IGNORE;
                      }
                      if (!isLt5M) {
                        message.error("图片不能超过10MB！");
                        return Upload.LIST_IGNORE;
                      }
                    return false; // 手动上传
                }}
                listType="picture-card"
                onPreview={handlePreview}
                onChange={handleChange}
            >
                {fileList.length >= 1 ? null : uploadButton}
            </Upload>

            {previewImage && (
                <Image
                    wrapperStyle={{ display: 'none' }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                />
            )}
        </>
    );
};

export default UploadAlbumCover;