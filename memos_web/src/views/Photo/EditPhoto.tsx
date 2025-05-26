import React, { useEffect } from 'react';
import type { FormProps } from 'antd';
import { App, Button, DatePicker, Form, Input, Modal } from 'antd';
import { editPhotoAPI } from '@/apis/photoAPI';
import type { Photo } from "@/types/index";
import dayjs from 'dayjs';

type FieldType = {
  name?: string;
  desc?: string;
  shootTime?: string;
  [key: string]: any;
};

interface EditPhotoProps {
  photo: Photo;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess: () => void; // 编辑成功后的回调（刷新列表）
}

const EditPhoto: React.FC<EditPhotoProps> = ({ photo, isModalOpen, setIsModalOpen, onSuccess }) => {
  const [form] = Form.useForm();
  const { message } = App.useApp();

  useEffect(() => {
    if (isModalOpen && photo) {
      form.resetFields();
      form.setFieldsValue({
        ...photo,
        shootTime: dayjs(photo.shootTime),
      });
    }
  }, [isModalOpen, photo._id]);

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    const formData = new FormData();
    if (values.shootTime) {
      values.shootTime = dayjs(values.shootTime).format('YYYY-MM-DD');
    }
    for (const key in values) {
      if (values.hasOwnProperty(key)) {
        formData.append(key, values[key]);
      }
    }
    formData.append('_id', photo._id as string);

    try {
      await editPhotoAPI(formData);
      message.success('编辑成功');
      onSuccess();
    } catch (error) {
      message.error('编辑失败');
    }
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Modal
      title="编辑图片"
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="图片名称"
          name="name"
          rules={[{ required: true, message: '请输入图片名字!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="拍摄时间"
          name="shootTime"
          rules={[{ required: true, message: '请选择日期!' }]}
        >
          <DatePicker />
        </Form.Item>

        <Form.Item<FieldType>
          label="图片描述"
          name="desc"
          rules={[{ required: true, message: '请输入图片描述!' }]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">确认</Button>
          <Button style={{ marginLeft: 20 }} onClick={() => setIsModalOpen(false)}>取消</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditPhoto;
