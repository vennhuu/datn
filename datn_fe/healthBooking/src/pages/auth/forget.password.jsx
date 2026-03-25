import { Button, Form, Input } from "antd";
import backgroundLogin from "../../assets/backgroundLogin.jpg";

const ForgotPassword = () => {
  const onFinish = (values) => {
    console.log("Forgot password:", values);
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
      }}
    >
      <div
        style={{
          width: 400,
          padding: 30,
          borderRadius: 12,
          background: "#fff",
          boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#2f6fa3" }}>
          Quên mật khẩu
        </h2>

        <p style={{ textAlign: "center", marginBottom: 20 }}>
          Nhập email để nhận link đặt lại mật khẩu
        </p>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input placeholder="Nhập email của bạn" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              style={{ background: "#2f6fa3", height: 40 }}
            >
              Gửi yêu cầu
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: "center" }}>
          <a href="/login">Quay lại đăng nhập</a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
