import React, { useState } from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons'; // Ant Design 提供的加号图标。
import { Image, Upload } from 'antd'; // Ant Design 提供的图片组件和上传组件。
import type { GetProp, UploadFile, UploadProps } from 'antd'; // Ant Design 中用于类型定义的工具
import axios from 'axios';

// 根据 UploadProps 中的 beforeUpload 方法的参数类型定义的自定义类型。
// Parameters<GetProp<UploadProps, 'beforeUpload'>> 会返回 beforeUpload 函数的参数类型组成的元组。
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

/**
 * 接收一个文件对象作为参数，返回一个 Promise，
 * 当文件读取成功时，Promise 会解析为文件的 Base64 编码字符串；
 * 如果读取失败，Promise 会被拒绝。
 * @param file 
 * @returns {Promise<string>}
 */
const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader(); //Web API对象 异步读取用户本地文件
    reader.readAsDataURL(file); // 将文件内容读取为 Data URL 格式(Base64)
    reader.onload = () => resolve(reader.result as string); // 文件读取成功的回调
    reader.onerror = (error) => reject(error); // 文件读取失败的回调
  });

// 定义组件 App
const App: React.FC = () => {
  // 使用 useState 钩子定义了三个状态
  const [previewOpen, setPreviewOpen] = useState(false); // 表示图片预览窗口是否打开
  const [previewImage, setPreviewImage] = useState(''); // 当前预览的图片的 URL
  const [fileList, setFileList] = useState<UploadFile[]>([]); // 已上传的文件列表

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

  /**
   * 上传文件改变时的回调
   * @param { fileList: newFileList } 
   * @returns UploadProps['onChange']
   */
  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  }


  // 定义了一个自定义的上传按钮，包含一个加号图标和 “Upload” 文本。
  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const handleSubmit = ()=>{
    fileList.forEach((file)=>{
      const formData = new FormData()
      console.log('sb',file.originFileObj);
      formData.append('file', file.originFileObj as FileType)
      axios({
        method: 'post',
        headers: {'Content-Type': 'multipart/form-data'},
        url: 'http://localhost:3000/photo/upload',
        data: formData
      }).then(response => {
        console.log('请求成功:', response.data);
    })
    .catch(error => {
        console.error('请求失败:', error);
    });;
      
    })
  }
  // 组件的返回值
  return (
    <>
      <Upload
        beforeUpload= {() => false}
        multiple
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
      >
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>
      
      {previewImage && (
        <Image
          wrapperStyle={{ display: 'none' }} // 让 Image 组件的包裹元素不显示
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            // 预览窗口的显示状态改变完成之后触发的回调函数
            // 当 visible 为 false（即预览窗口关闭）时，会执行 setPreviewImage('') 操作
            // 将 previewImage 状态设置为空字符串，这样做可以清理当前预览的图片 URL，为下一次预览做准备。
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}
    <Button type="primary" onClick={handleSubmit}>提交</Button>
    </>
  );
};

export default App;