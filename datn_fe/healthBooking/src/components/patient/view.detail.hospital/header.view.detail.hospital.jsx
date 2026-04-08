import { Rate } from "antd";
import { EnvironmentOutlined, PhoneOutlined, StarFilled } from "@ant-design/icons";

const HospitalHeader = ({ data }) => (
  <div style={s.card}>
    <div style={s.imgWrap}>
      <img
        src={`${import.meta.env.VITE_BACKEND_URL}/storage/logo_hospital/${data.logo}`}
        alt={data.name}
        style={s.img}
        onError={(e) => { e.target.src = ""; e.target.style.display = "none"; }}
      />
    </div>

    <div style={s.info}>
      <div style={s.badge}>Bệnh viện công lập</div>
      <h2 style={s.name}>{data.name}</h2>

      <div style={s.row}>
        <EnvironmentOutlined style={s.icon} />
        <span style={s.text}>{data.address}</span>
      </div>

      {data.phone && (
        <div style={s.row}>
          <PhoneOutlined style={s.icon} />
          <span style={s.text}>{data.phone}</span>
        </div>
      )}

      <div style={s.ratingRow}>
        <Rate disabled value={data.rating} allowHalf style={{ fontSize: 16 }} />
        <span style={s.ratingNum}>{data.rating?.toFixed(1)}</span>
        <span style={s.ratingCount}>(150 đánh giá)</span>
      </div>
    </div>
  </div>
);

const s = {
  card: {
    display: "flex", gap: 24, background: "#fff",
    padding: 28, borderRadius: 20,
    boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
    marginBottom: 20,
  },
  imgWrap: {
    width: 130, height: 130, borderRadius: 16, overflow: "hidden",
    background: "#eef4ff", flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
    border: "1px solid #e8edf3",
  },
  img: { width: "100%", height: "100%", objectFit: "cover" },
  info: { flex: 1 },
  badge: {
    display: "inline-block", background: "#eef4ff", color: "#0a6abf",
    fontSize: 11, fontWeight: 600, padding: "3px 10px",
    borderRadius: 20, marginBottom: 10,
  },
  name: { fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 12px" },
  row: { display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 },
  icon: { color: "#0a6abf", marginTop: 2, flexShrink: 0 },
  text: { fontSize: 14, color: "#475569", lineHeight: 1.5 },
  ratingRow: { display: "flex", alignItems: "center", gap: 8, marginTop: 10 },
  ratingNum: { fontSize: 15, fontWeight: 700, color: "#0f172a" },
  ratingCount: { fontSize: 13, color: "#94a3b8" },
};

export default HospitalHeader;