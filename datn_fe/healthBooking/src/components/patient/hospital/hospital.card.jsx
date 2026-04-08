import { useState } from "react";
import { Link } from "react-router-dom";
import { EnvironmentOutlined, ArrowRightOutlined, MedicineBoxOutlined } from "@ant-design/icons";
import { s } from "./hospital.style";

const getRatingInfo = (rating) => {
  if (rating >= 4.5) return { label: "Xuất sắc", bg: "#edfaf3", color: "#0e9a57" };
  if (rating >= 4.0) return { label: "Rất tốt", bg: "#eef4ff", color: "#0a6abf" };
  if (rating >= 3.0) return { label: "Tốt", bg: "#fffbeb", color: "#b45309" };
  return { label: "Trung bình", bg: "#f8fafc", color: "#64748b" };
};

const StarRow = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{
          fontSize: 12,
          color: i <= full ? "#f5a623" : (i === full + 1 && half ? "#f5a623" : "#e2e8f0"),
        }}>★</span>
      ))}
      <span style={{ fontSize: 12, fontWeight: 600, color: "#1e2d3d", marginLeft: 4 }}>
        {rating?.toFixed(1)}
      </span>
    </div>
  );
};

const HospitalCard = ({ item }) => {
  const { label, bg, color } = getRatingInfo(item.rating);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{ ...s.card, ...(hovered ? s.cardHover : {}) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={s.imgWrap}>
        <img
          src={`${import.meta.env.VITE_BACKEND_URL}/storage/logo_hospital/${item.logo}`}
          alt={item.name}
          style={{ ...s.img, transform: hovered ? "scale(1.06)" : "scale(1)" }}
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
        <div style={{ ...s.imgFallback, display: "none" }}>🏥</div>
        <div style={s.badge}>
          <MedicineBoxOutlined style={{ fontSize: 10, marginRight: 3 }} />
          Bệnh viện
        </div>
      </div>

      <div style={s.body}>
        <div>
          <h3 style={s.name}>{item.name}</h3>
          <div style={s.address}>
            <EnvironmentOutlined style={{ color: "#0a6abf", fontSize: 12, flexShrink: 0, marginTop: 1 }} />
            <span>{item.address}{item.city ? `, ${item.city}` : ""}</span>
          </div>
          {item.introduction && <p style={s.intro}>{item.introduction}</p>}
        </div>

        <div style={s.bottom}>
          <div style={s.ratingRow}>
            <StarRow rating={item.rating || 0} />
            <span style={{ ...s.ratingBadge, background: bg, color }}>{label}</span>
          </div>
          <Link to={`/hospital/${item.id}`}>
            <button style={{ ...s.detailBtn, ...(hovered ? s.detailBtnHover : {}) }}>
              Chi tiết <ArrowRightOutlined style={{ fontSize: 11 }} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HospitalCard;