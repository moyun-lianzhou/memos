import React, { useRef, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { App, Button, Image, Upload } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { getBase64 } from "@/utils/fileGetBase64";
import { checkIfHashExistsAPI, uploadPhotoAPI } from "@/apis/photoAPI";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useNavigate } from "react-router";
import { getImageDimension } from '@/utils/getImageDimension'
import { uploadChunksWithResume } from '@/utils/sliceUpload'
import { getFileHash } from '@/utils/getFileHash';

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const UploadPhoto: React.FC<{ albumId: string }> = ({ albumId }) => {
    const { message } = App.useApp()
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploading, setUploading] = useState(false);
    const user = useSelector((state: RootState) => state.user)
    const navigate = useNavigate()
    const warningDisplayed = useRef(false); // 用 useRef 控制警告节流，避免多次弹窗
    const warningTimeout = useRef<NodeJS.Timeout | null>(null);  // useRef 存储计时器 ID

    /**
     * 处理图片预览
     */
    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }
        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    /**
     * 监听文件列表变化
     */
    const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    /**
     * 处理文件上传
     */
    const handleUpload = async () => {
        if (fileList.length === 0) {
            message.warning("请选择要上传的图片");
            return;
        }
        setUploading(true);
        try {
            let uploadCnt = 0
            for (const file of fileList) {
                const originFile = file.originFileObj as File;

                // 同相册图片过滤
                const hash = await getFileHash(originFile)
                const isHashExist = await checkIfHashExistsAPI(hash, albumId);
                if (isHashExist.data.exists) continue

                //  大图分片上传、断点续传
                if (originFile.size > 3 * 1024 * 1024) {
                    const start_time = Date.now()
                    await uploadChunksWithResume(originFile, user.userId!, albumId, hash, (p: any) => `大文件上传进度：${p}%`);
                    const end_time = Date.now()
                    console.log(`大图-${originFile.name}大小${(originFile.size / (1024 * 1024)).toFixed(2)}MB，用时${end_time - start_time}ms`);
                } else {
                    // 小图普通上传
                    const start_time = Date.now()
                    const formData = new FormData();
                    const { width, height } = await getImageDimension(originFile);
                    ;
                    formData.append("photoMeta", JSON.stringify({ width, height }));
                    formData.append("hash", hash);
                    formData.append("albumId", albumId);
                    formData.append("userId", user.userId!);
                    formData.append("photos", originFile)

                    await uploadPhotoAPI(formData);
                    const end_time = Date.now()
                    console.log(`小图-${originFile.name}大小${(originFile.size / (1024 * 1024)).toFixed(2)}MB，用时${end_time - start_time}ms`);
                }
                uploadCnt += 1
            }
            if (uploadCnt > 0) message.success(`成功上传${uploadCnt}张图片，${fileList.length - uploadCnt}张图片已经存在`);
            else message.info('图片在此相册中已经存在')
            setFileList([]);
            navigate(`/photo?albumId=${albumId}`);
        } catch (err) {
            message.error("上传失败");
        } finally {
            setUploading(false);
        };

    };

    const uploadButton = (
        <button style={{ border: 0, background: "none" }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    return (
        <>
            <Upload
                beforeUpload={(file, newFileList) => {
                    const isImage = (file.type === 'image/png' || file.type === 'image/jpeg') ? true : false
                    const isLt5M = file.size / 1024 / 1024 < 20;
                    const tooMany = fileList.length + newFileList.length > 20;

                    if (!isImage) {
                        message.error("只能上传 png 或 jpg 图片格式！");
                        return Upload.LIST_IGNORE;
                    }

                    if (!isLt5M) {
                        message.error("图片不能超过 20MB！");
                        return Upload.LIST_IGNORE;
                    }

                    if (tooMany) {
                        if (!warningDisplayed.current) {
                            warningDisplayed.current = true;
                            // 清除之前的计时器，避免创建多个 `setTimeout`
                            if (warningTimeout.current) clearTimeout(warningTimeout.current);
                            message.warning("最多一次上传 20 张图片！");
                            warningTimeout.current = setTimeout(() => {
                                warningDisplayed.current = false;
                            }, 1000);
                        }
                        return Upload.LIST_IGNORE;
                    }

                    return false; // 手动上传
                }}
                multiple
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
            >
                {fileList.length >= 20 ? null : uploadButton}
            </Upload>

            {previewImage && (
                <Image
                    wrapperStyle={{ display: "none" }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) => !visible && setPreviewImage(""),
                    }}
                    src={previewImage}
                />
            )}

            <Button block type="primary" onClick={handleUpload} loading={uploading} disabled={fileList.length === 0 || uploading}>
                {uploading ? "上传中..." : "上传"}
            </Button>
        </>
    );
};

export default UploadPhoto;
