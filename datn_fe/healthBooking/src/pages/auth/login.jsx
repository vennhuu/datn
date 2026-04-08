import { Form, Input, Button, notification } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import backgroundLogin from "../../assets/backgroundLogin.jpg"
import { loginUserAPI } from "../../services/api.services.auth";

const Login = () => {
  const onFinish = async (values) => {
  try {
    const res = await loginUserAPI(values.email, values.password);

    if (res && res.data) {
      localStorage.setItem("access_token", res.data.accessToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      notification.success({
        message: "Đăng nhập thành công",
        description: `Chào mừng ${res.data.user?.name}!`,
      });

      const roleName = res.data.user?.role?.name;
      if (roleName === "ROLE_DOCTOR") {
        window.location.href = "/doctor";
      } else if (roleName === "ROLE_ADMIN") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/";
      }

    } else {  // ← đóng if ở đây, KHÔNG có window.location.href ở giữa
      notification.error({
        message: "Đăng nhập thất bại",
        description: res?.message || "Sai email hoặc mật khẩu",
      });
    }
  } catch (error) {
    console.log(error);
    notification.error({
      message: "Lỗi server",
      description: error?.response?.data?.message || "Vui lòng thử lại sau",
    });
  }
};

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage:
          `url(${backgroundLogin})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        style={{
          width: 900,
          height: 500,
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
            padding: 40,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h2 style={{ color: "#2f6fa3" }}>HSSK</h2>
          <p style={{ marginBottom: 20 }}>Hồ sơ sức khỏe</p>

          <h3>Đăng nhập</h3>

          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
            >
              <Input.Password
                placeholder="Mật khẩu"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            <div style={{ textAlign: "right", marginBottom: 10 }}>
              <a href="/forgot-password">Quên mật khẩu</a>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                style={{ background: "#2f6fa3", height: 40 }}
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>

          <div style={{ marginTop: 10 }}>
            Chưa có tài khoản? <a href="/register">Đăng kí</a>
          </div>

          <div style={{ textAlign: "center", marginTop: 16 }}>
            <p style={{ color: "#999", marginBottom: 12 }}>Hoặc đăng nhập với</p>
            <Button
                icon={<img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png"
                    width={18} style={{ marginRight: 8 }} />}
                onClick={() => window.location.href = "http://localhost:8080/oauth2/authorization/google"}
                style={{ width: "100%", height: 40, display: "flex",
                    alignItems: "center", justifyContent: "center" }}
            >
                Đăng nhập với Google
            </Button>
        </div>

          <div style={{ marginTop: 20 }}>
            <b>TỔNG ĐÀI HỖ TRỢ</b>
            <p>Hotline: 19009095</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;