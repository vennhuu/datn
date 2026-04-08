import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";

const OAuth2Callback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const name = params.get("name");
        const email = params.get("email");
        const avatar = params.get("avatar");
        const id = params.get("id");
        const role = params.get("role");

        if (token) {
            // Lưu vào localStorage giống như login thường
            localStorage.setItem("access_token", token);
            localStorage.setItem("user", JSON.stringify({
                id, name, email, avatar, role: { name: role }
            }));

            notification.success({
                message: `Chào mừng ${name}!`,
            });

            navigate("/");
        } else {
            notification.error({ message: "Đăng nhập Google thất bại" });
            navigate("/login");
        }
    }, []);

    return (
        <div style={{ display: "flex", justifyContent: "center",
            alignItems: "center", height: "100vh" }}>
            <p>Đang xử lý đăng nhập...</p>
        </div>
    );
};

export default OAuth2Callback;