import { useState } from "react";
import { Button, Tooltip, message } from "antd";
import { EnvironmentOutlined, CompassOutlined, LoadingOutlined } from "@ant-design/icons";

const HospitalMap = ({ address, hospitalName }) => {
  const [locating, setLocating] = useState(false);

  const encodedAddress = encodeURIComponent(address || hospitalName || "");

  const mapSrc = `https://maps.google.com/maps?q=${encodedAddress}&output=embed&hl=vi&z=15`;

  const handleDirections = () => {
    setLocating(true);

    if (!navigator.geolocation) {
      // Nếu browser không hỗ trợ geolocation → mở Maps không có origin
      const fallbackUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
      window.open(fallbackUrl, "_blank");
      setLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${encodedAddress}&travelmode=driving`;
        window.open(url, "_blank");
        setLocating(false);
      },
      (error) => {
        // Người dùng từ chối hoặc lỗi → mở Maps không có origin
        message.warning("Không lấy được vị trí. Mở Google Maps không có điểm xuất phát.");
        const fallbackUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
        window.open(fallbackUrl, "_blank");
        setLocating(false);
      },
      { timeout: 8000 }
    );
  };

  return (
    <div style={{ marginTop: 32 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <EnvironmentOutlined style={{ fontSize: 18, color: "#2f6fa3" }} />
          <span style={{ fontSize: 16, fontWeight: 600, color: "#1a1a1a" }}>
            Vị trí bệnh viện
          </span>
        </div>

        <Tooltip title="Mở Google Maps và chỉ đường từ vị trí của bạn">
          <Button
            type="primary"
            icon={locating ? <LoadingOutlined /> : <CompassOutlined />}
            onClick={handleDirections}
            loading={locating}
            style={{
              background: "#2f6fa3",
              border: "none",
              borderRadius: 8,
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            {locating ? "Đang lấy vị trí..." : "Chỉ đường tới đây"}
          </Button>
        </Tooltip>
      </div>

      {/* Address text */}
      {address && (
        <p
          style={{
            fontSize: 14,
            color: "#666",
            marginBottom: 12,
            display: "flex",
            alignItems: "flex-start",
            gap: 6,
          }}
        >
          <EnvironmentOutlined style={{ marginTop: 2, color: "#e74c3c", flexShrink: 0 }} />
          {address}
        </p>
      )}

      {/* Map iframe — click mở Google Maps */}
      <div
        style={{
          position: "relative",
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid #e8e8e8",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          cursor: "pointer",
        }}
        onClick={handleDirections}
        title="Nhấn để xem đường đi trên Google Maps"
      >
        <iframe
          title={`Bản đồ ${hospitalName}`}
          src={mapSrc}
          width="100%"
          height="380"
          style={{ display: "block", border: "none", pointerEvents: "none" }}
          loading="lazy"
          allowFullScreen
        />

        {/* Overlay hover hint */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(47, 111, 163, 0)",
            transition: "background 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(47, 111, 163, 0.08)";
            e.currentTarget.querySelector("span").style.opacity = "1";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(47, 111, 163, 0)";
            e.currentTarget.querySelector("span").style.opacity = "0";
          }}
        >
          <span
            style={{
              opacity: 0,
              background: "rgba(47,111,163,0.92)",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              transition: "opacity 0.2s",
              pointerEvents: "none",
            }}
          >
            Nhấn để xem đường đi
          </span>
        </div>
      </div>
    </div>
  );
};

export default HospitalMap;