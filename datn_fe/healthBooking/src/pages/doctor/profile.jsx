import React from "react";
import { Card, Form, Input, Button } from "antd";

const ProfileDoctor = () => {
  return (
    <Card title="👨‍⚕️ Hồ sơ cá nhân">
      <Form layout="vertical">
        <Form.Item label="Tên bác sĩ">
          <Input defaultValue="Phước" />
        </Form.Item>

        <Form.Item label="Chuyên khoa">
          <Input defaultValue="Nội tổng quát" />
        </Form.Item>

        <Form.Item label="Số điện thoại">
          <Input defaultValue="0123456789" />
        </Form.Item>

        <Button type="primary">Cập nhật</Button>
      </Form>
    </Card>
  );
};

export default ProfileDoctor;