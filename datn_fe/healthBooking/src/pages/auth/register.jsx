import { Form, Input, Button, DatePicker, Select, Row, Col, Upload, Avatar } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone, UploadOutlined, UserOutlined } from "@ant-design/icons";
import backgroundLogin from "../../assets/backgroundLogin.jpg";

const { Option } = Select;

const Register = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Register:", values);
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${backgroundLogin})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        style={{
          width: 1000,
          height: 650,
          display: "flex",
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
          background: "#fff",
        }}
      >
        {/* LEFT */}
        <div
          style={{
            flex: 1,
            background: "#2f6fa3",
            color: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/2966/2966485.png"
            alt="logo"
            style={{ width: 100, marginBottom: 20 }}
          />

          <h2>Sức khỏe là sự sống</h2>
          <p>QUẢN LÝ SỨC KHỎE</p>
        </div>

        {/* RIGHT */}
        <div
          style={{
            flex: 1,
            padding: 20,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h2 style={{ color: "#2f6fa3" }}>HSSK</h2>
          <p style={{ marginBottom: 5 }}>Hồ sơ sức khỏe</p>

          <h3>Đăng kí</h3>

          <Form layout="vertical" form={form} onFinish={onFinish}>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Họ và tên"
                  rules={[{ required: true, message: "Nhập họ tên" }]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: "Nhập email" },
                    { type: "email", message: "Email không hợp lệ" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={12}>
              <Col span={12}>
                <Form.Item
                  name="password"
                  label="Mật khẩu"
                  rules={[{ required: true, message: "Nhập mật khẩu" }]}
                >
                  <Input.Password
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="confirmPassword"
                  label="Nhập lại mật khẩu"
                  dependencies={["password"]}
                  rules={[
                    { required: true, message: "Nhập lại mật khẩu" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject("Mật khẩu không khớp");
                      },
                    }),
                  ]}
                >
                  <Input.Password />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={12}>
              <Col span={12}>
                <Form.Item
                  name="gender"
                  label="Giới tính"
                  rules={[{ required: true, message: "Chọn giới tính" }]}
                >
                  <Select>
                    <Option value="NAM">Nam</Option>
                    <Option value="NU">Nữ</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="mobile"
                  label="Số điện thoại"
                  rules={[
                    { required: true, message: "Nhập SĐT" },
                    { pattern: /^[0-9]{10}$/, message: "SĐT không hợp lệ" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={12}>
              <Col span={12}>
                <Form.Item
                  name="birthday"
                  label="Ngày sinh"
                  rules={[{ required: true, message: "Chọn ngày sinh" }]}
                >
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="address"
                  label="Địa chỉ"
                  rules={[{ required: true, message: "Nhập địa chỉ" }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            {/* AVATAR */}
            <Form.Item name="avatar" label="Ảnh đại diện">
              <Upload beforeUpload={() => false} maxCount={1}>
                <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                style={{ background: "#2f6fa3", height: 40 }}
              >
                Đăng kí
              </Button>
            </Form.Item>
          </Form>

          <div style={{ marginTop: 10 }}>
            Đã có tài khoản? <a href="/login">Đăng nhập</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;