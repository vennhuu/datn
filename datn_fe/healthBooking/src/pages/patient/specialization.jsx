import { Row, Col } from "antd";

const specialties = [
  { name: "Nội tổng quát", icon: "💊" },
  { name: "Ngoại khoa", icon: "🔪" },
  { name: "Sản phụ khoa", icon: "🤰" },
  { name: "Nhi khoa", icon: "👶" },
  { name: "Tim mạch", icon: "❤️" },
  { name: "Da liễu", icon: "🧴" },
  { name: "Tai mũi họng", icon: "👂" },
  { name: "Mắt", icon: "👁️" },
  { name: "Thần kinh", icon: "🧠" },
  { name: "Cơ xương khớp", icon: "🦴" },
  { name: "Tiêu hóa", icon: "🍽️" },
  { name: "Nội tiết", icon: "⚗️" },
  { name: "Hô hấp", icon: "🫁" },
  { name: "Tâm lý", icon: "🙂" },
];

const Specialization = () => {
  return (
    <div
      style={{
        padding: "40px 80px",
        background: "#f5f7fa",
      }}
    >
      <h2 style={{ marginBottom: 30, fontSize: 28 }}>
        Dịch vụ toàn diện
      </h2>

      <Row gutter={[20, 20]}>
        {specialties.map((item, index) => (
          <Col span={12} key={index}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                padding: "25px 30px",
                background: "#fff",
                borderRadius: 20,
                border: "1px solid #eee",
                cursor: "pointer",
                transition: "0.3s",

                // background pattern nhẹ
                backgroundImage:
                  "radial-gradient(#e6f4ff 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 20px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* ICON */}
              <div
                style={{
                  fontSize: 40,
                  background: "#e6f4ff",
                  padding: 15,
                  borderRadius: 12,
                }}
              >
                {item.icon}
              </div>

              {/* TEXT */}
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 500,
                }}
              >
                {item.name}
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Specialization;