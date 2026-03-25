import {
  MedicineBoxOutlined,
  ScissorOutlined,
  HeartOutlined,
  SkinOutlined,
  EyeOutlined,
  UserOutlined,
  ExperimentOutlined,
  ThunderboltOutlined,
  FireOutlined,
  SmileOutlined,
  CloudOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";

import { Card } from "antd";
import { useRef } from "react";

const Specialization = () => {
  const scrollRef = useRef(null);

  const specializations = [
    { name: "Nội tổng quát", icon: <MedicineBoxOutlined /> },
    { name: "Ngoại khoa", icon: <ScissorOutlined /> },
    { name: "Sản phụ khoa", icon: <UserOutlined /> },
    { name: "Nhi khoa", icon: <SmileOutlined /> },
    { name: "Tim mạch", icon: <HeartOutlined /> },
    { name: "Da liễu", icon: <SkinOutlined /> },
    { name: "Tai mũi họng", icon: <UserOutlined /> },
    { name: "Mắt", icon: <EyeOutlined /> },
    { name: "Thần kinh", icon: <ThunderboltOutlined /> },
    { name: "Cơ xương khớp", icon: <UserOutlined /> },
    { name: "Tiêu hóa", icon: <FireOutlined /> },
    { name: "Nội tiết", icon: <ExperimentOutlined /> },
    { name: "Hô hấp", icon: <CloudOutlined /> },
    { name: "Tâm lý", icon: <SmileOutlined /> },
  ];

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div style={{ padding: "40px 0", position: "relative" }}>
      <h2 style={{ marginBottom: 20 }}>Chuyên khoa phổ biến</h2>

      {/* Nút trái */}
      <div
        onClick={() => scroll("left")}
        style={arrowStyle("left")}
      >
        <LeftOutlined />
      </div>

      {/* Nút phải */}
      <div
        onClick={() => scroll("right")}
        style={arrowStyle("right")}
      >
        <RightOutlined />
      </div>

      {/* Scroll container */}
      <div
        ref={scrollRef}
        style={{
          display: "flex",
          gap: 16,
          overflowX: "auto",
          scrollBehavior: "smooth",
          paddingBottom: 10,
        }}
      >
        {specializations.map((item, index) => (
          <Card
            key={index}
            hoverable
            style={{
              minWidth: 220,
              textAlign: "center",
              borderRadius: 12,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                fontSize: 40,
                color: "#1890ff",
                marginBottom: 10,
              }}
            >
              {item.icon}
            </div>
            <p style={{ fontWeight: 500 }}>{item.name}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

// style nút
const arrowStyle = (position) => ({
  position: "absolute",
  top: "50%",
  [position]: 0,
  transform: "translateY(-50%)",
  zIndex: 10,
  background: "#fff",
  borderRadius: "50%",
  width: 40,
  height: 40,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  cursor: "pointer",
});

export default Specialization;