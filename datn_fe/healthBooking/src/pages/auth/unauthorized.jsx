import { useNavigate } from "react-router-dom";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")); }
    catch { return null; }
  })();

  const roleName = user?.role?.name || "Không xác định";

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "#f5f7fa"
    }}>
      <div style={{
        background: "#fff", border: "1px solid #e8e8e8", borderRadius: 16,
        padding: "3rem 2.5rem", maxWidth: 460, width: "100%", textAlign: "center",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)"
      }}>

        {/* Icon */}
        <div style={{
          width: 80, height: 80, borderRadius: "50%", background: "#FCEBEB",
          display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem"
        }}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <rect x="8" y="16" width="20" height="14" rx="3" fill="#F09595" stroke="#E24B4A" strokeWidth="1.5"/>
            <path d="M12 16v-4a6 6 0 0 1 12 0v4" stroke="#E24B4A" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="18" cy="22" r="2" fill="#A32D2D"/>
            <line x1="18" y1="24" x2="18" y2="27" stroke="#A32D2D" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Badge lỗi */}
        <span style={{
          fontSize: 13, fontWeight: 500, color: "#A32D2D", background: "#FCEBEB",
          borderRadius: 6, padding: "4px 12px", display: "inline-block", marginBottom: "1rem"
        }}>
          Lỗi 403 — Forbidden
        </span>

        <h1 style={{ fontSize: 22, fontWeight: 600, color: "#1a1a1a", margin: "0 0 0.75rem" }}>
          Bạn không có quyền truy cập
        </h1>

        <p style={{ fontSize: 15, color: "#666", lineHeight: 1.7, margin: "0 0 1.5rem" }}>
          Trang này chỉ dành cho một số vai trò nhất định.
          Tài khoản hiện tại của bạn không được phép vào đây.
        </p>

        {/* Role badge */}
        <div style={{
          background: "#f5f7fa", borderRadius: 8, padding: "0.75rem 1rem",
          marginBottom: "2rem", display: "flex", alignItems: "center",
          gap: 8, justifyContent: "center"
        }}>
          <span style={{ fontSize: 13, color: "#888" }}>Vai trò hiện tại của bạn:</span>
          <span style={{
            fontSize: 12, fontWeight: 500, background: "#E6F1FB",
            color: "#185FA5", borderRadius: 6, padding: "3px 10px"
          }}>
            {roleName}
          </span>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: "1.5rem" }}>
          <button
            onClick={() => navigate("/")}
            style={{
              background: "#2f6fa3", color: "#fff", border: "none",
              borderRadius: 8, padding: "10px 24px", fontSize: 14,
              fontWeight: 500, cursor: "pointer"
            }}
          >
            Về trang chủ
          </button>
          <button
            onClick={() => { localStorage.clear(); navigate("/login"); }}
            style={{
              background: "transparent", color: "#666", border: "1px solid #ddd",
              borderRadius: 8, padding: "10px 24px", fontSize: 14, cursor: "pointer"
            }}
          >
            Đổi tài khoản
          </button>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid #f0f0f0", margin: "0 0 1rem" }} />

        <p style={{ fontSize: 13, color: "#aaa", margin: 0 }}>
          Nếu bạn cho rằng đây là nhầm lẫn, liên hệ{" "}
          <b style={{ color: "#888", fontWeight: 500 }}>hỗ trợ: 19009095</b>
        </p>

      </div>
    </div>
  );
};

export default UnauthorizedPage;