import { Rate, Tag } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const DoctorHeader = ({ doctor }) => (
  <div style={s.card}>
    <div style={s.avatarWrap}>
      <img
        src={`${import.meta.env.VITE_BACKEND_URL}/storage/avt_doctor/${doctor.avatar}`}
        alt={doctor.name}
        style={s.avatar}
      />
    </div>
    <div style={s.info}>
      <Tag color="blue" style={{ marginBottom: 10 }}>{doctor.specialization}</Tag>
      <h2 style={s.name}>{doctor.name}</h2>
      <div style={s.hospital}>
        <EnvironmentOutlined style={{ color: "#0a6abf" }} />
        <Link to={`/hospital/${doctor.hospital?.id}`} style={s.hospitalLink}>
          {doctor.hospital?.name}
        </Link>
      </div>
      <div style={s.ratingRow}>
        <Rate disabled allowHalf value={doctor.rating || 4.5} style={{ fontSize: 15 }} />
        <span style={s.ratingNum}>{(doctor.rating || 4.5).toFixed(1)}</span>
        <span style={s.ratingCount}>(150 đánh giá)</span>
      </div>
    </div>
  </div>
);

const s = {
  card: {
    display: "flex", gap: 24, background: "#fff",
    padding: 28, borderRadius: 20,
    boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
  },
  avatarWrap: {
    width: 110, height: 110, borderRadius: "50%", overflow: "hidden",
    border: "3px solid #eef4ff", flexShrink: 0,
  },
  avatar: { width: "100%", height: "100%", objectFit: "cover" },
  info: { flex: 1 },
  name: { fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 10px" },
  hospital: { display: "flex", alignItems: "center", gap: 8, marginBottom: 10 },
  hospitalLink: { fontSize: 14, color: "#0a6abf", fontWeight: 500 },
  ratingRow: { display: "flex", alignItems: "center", gap: 8 },
  ratingNum: { fontWeight: 700, color: "#0f172a" },
  ratingCount: { fontSize: 13, color: "#94a3b8" },
};

export default DoctorHeader;