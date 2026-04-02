import { useState } from "react";
import { Button, Form, Input, Modal, notification } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import backgroundLogin from "../../assets/backgroundLogin.jpg";
import { forgotPasswordAPI, resetPasswordAPI } from "../../services/api.services.auth";

const ForgotPassword = () => {
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pendingEmail, setPendingEmail] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loadingSend, setLoadingSend] = useState(false);
    const [loadingReset, setLoadingReset] = useState(false);


    const onFinish = async (values) => {
        setLoadingSend(true);
        try {
            await forgotPasswordAPI(values.email);
            setPendingEmail(values.email);
            setIsModalOpen(true);
            notification.success({ message: `Đã gửi mã xác thực về ${values.email}` });
        } catch (error) {
            notification.error({
                message: "Gửi mã thất bại",
                description: error?.message || "Email không tồn tại",
            });
        } finally {
            setLoadingSend(false);
        }
    };

    const handleReset = async () => {
        if (!code) {
            notification.warning({ message: "Vui lòng nhập mã xác thực" });
            return;
        }
        if (!newPassword) {
            notification.warning({ message: "Vui lòng nhập mật khẩu mới" });
            return;
        }
        if (newPassword !== confirmPassword) {
            notification.warning({ message: "Mật khẩu không khớp" });
            return;
        }

        setLoadingReset(true);
        try {
            await resetPasswordAPI(pendingEmail, code, newPassword);
            notification.success({
                message: "Đặt lại mật khẩu thành công!",
                description: "Vui lòng đăng nhập lại",
            });
            setIsModalOpen(false);
            window.location.href = "/login";
        } catch (error) {
            notification.error({
                message: "Thất bại",
                description: error?.message || "Mã không đúng hoặc đã hết hạn",
            });
        } finally {
            setLoadingReset(false);
        }
    };

    return (
        <div style={{
            height: "100vh", display: "flex", justifyContent: "center", alignItems: "center",
            backgroundImage: `url(${backgroundLogin})`, backgroundSize: "cover",
            backgroundPosition: "center",
        }}>
            <div style={{
                width: 400, padding: 30, borderRadius: 12,
                background: "#fff", boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
            }}>
                <h2 style={{ textAlign: "center", color: "#2f6fa3" }}>Quên mật khẩu</h2>
                <p style={{ textAlign: "center", marginBottom: 20 }}>
                    Nhập email để nhận mã xác thực
                </p>

                <Form layout="vertical" form={form} onFinish={onFinish}>
                    <Form.Item name="email"
                        rules={[
                            { required: true, message: "Vui lòng nhập email" },
                            { type: "email", message: "Email không hợp lệ" },
                        ]}>
                        <Input placeholder="Nhập email của bạn" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block
                            loading={loadingSend}
                            style={{ background: "#2f6fa3", height: 40 }}>
                            Gửi mã xác thực
                        </Button>
                    </Form.Item>
                </Form>

                <div style={{ textAlign: "center" }}>
                    <a href="/login">Quay lại đăng nhập</a>
                </div>
            </div>

            {/* Modal nhập mã + mật khẩu mới */}
            <Modal
                title="Đặt lại mật khẩu"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                maskClosable={false}
            >
                <p>Mã xác thực đã gửi về <b>{pendingEmail}</b></p>
                <p style={{ color: "gray", fontSize: 13 }}>Mã có hiệu lực trong 5 phút</p>

                <Input
                    placeholder="Nhập mã 6 số"
                    maxLength={6}
                    size="large"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    style={{ marginBottom: 12, letterSpacing: 8, textAlign: "center" }}
                />

                <Input.Password
                    placeholder="Mật khẩu mới"
                    size="large"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{ marginBottom: 12 }}
                    iconRender={(visible) =>
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                />

                <Input.Password
                    placeholder="Nhập lại mật khẩu mới"
                    size="large"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{ marginBottom: 16 }}
                    iconRender={(visible) =>
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                />

                <Button type="primary" block loading={loadingReset}
                    onClick={handleReset}
                    style={{ background: "#2f6fa3" }}>
                    Xác nhận đặt lại mật khẩu
                </Button>
            </Modal>
        </div>
    );
};

export default ForgotPassword;
