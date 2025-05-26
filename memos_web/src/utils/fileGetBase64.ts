import type { GetProp, UploadProps } from 'antd';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

/**
 * 接收一个文件对象作为参数，返回一个 Promise，
 * 当文件读取成功时，Promise 会解析为文件的 Base64 编码字符串；
 * 如果读取失败，Promise 会被拒绝。
 * @param file 
 * @returns {Promise<string>}
 */
export const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader(); //Web API对象 异步读取用户本地文件
        reader.readAsDataURL(file); // 将文件内容读取为 Data URL 格式(Base64)
        reader.onload = () => resolve(reader.result as string); // 文件读取成功的回调
        reader.onerror = (error) => reject(error); // 文件读取失败的回调
    });
