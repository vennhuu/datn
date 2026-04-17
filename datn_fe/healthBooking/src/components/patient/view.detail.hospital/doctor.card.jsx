import { useState } from "react";
import { Empty, Tag } from "antd";
import { Link } from "react-router-dom";
import { EnvironmentOutlined, ArrowRightOutlined } from "@ant-design/icons";

const SCHEDULES = [
  "08:00", "08:30", "09:00", "09:30",
  "10:00", "10:30", "13:30", "14:00", "14:30",
];

const DoctorCard = ({ doc }) => {
  const [selectedTime, setSelectedTime] = useState(null);

  return (
    <div style={s.card}>
      {/* LEFT — Doctor info */}
      <div style={s.left}>
        <img
          src={`${import.meta.env.VITE_BACKEND_URL}/storage/avt_doctor/${doc.avatar}`}
          alt={doc.name}
          style={s.avatar}
          onError={(e) => { e.target.src = ""; }}
        />
        <div style={s.info}>
          <h3 style={s.name}>{doc.degree} {doc.name}</h3>
          <Tag color="blue" style={{ marginBottom: 8 }}>{doc.specialization}</Tag>
          <p style={s.bio}>{doc.bio || "Chưa có mô tả"}</p>
          <div style={s.addressRow}>
            <EnvironmentOutlined style={{ color: "#0a6abf", fontSize: 13 }} />
            <span style={s.addressText}>{doc.hospitalName || "Hà Nội"}</span>
          </div>
          <Link to={`/doctors/${doc.id}`}>
            <button style={s.detailBtn}>
              Xem hồ sơ <ArrowRightOutlined style={{ fontSize: 11 }} />
            </button>
          </Link>
        </div>
      </div>

      {/* DIVIDER */}
      <div style={s.divider} />

      {/* RIGHT — Booking */}
      <div style={s.right}>
        <div style={s.bookingTitle}>📅 Lịch khám hôm nay</div>

        <div style={s.slots}>
          {SCHEDULES.map((time) => (
            <div
              key={time}
              onClick={() => setSelectedTime(time)}
              style={{
                ...s.slot,
                ...(selectedTime === time ? s.slotActive : {}),
              }}
            >
              {time}
            </div>
          ))}
        </div>

        <p style={s.hint}>Chọn giờ và đặt · Phí đặt lịch 0đ</p>

        <div style={s.price}>
          Giá khám: <span style={s.priceNum}>{doc.price ? `${Number(doc.price).toLocaleString("vi-VN")}đ` : "Liên hệ"}</span>
        </div>

        <Link to={`/doctors/${doc.id}`}>
        <button
          // disabled={!selectedTime}
          style={{ ...s.bookBtn, ...(selectedTime ? {} : s.bookBtnDisabled) }}
        >
          Đặt lịch ngay
          
        </button>
        </Link>
      </div>
    </div>
  );
};

const DoctorListByHospitalId = ({ doctors }) => {
  if (!doctors || doctors.length === 0) {
    return (
      <div style={{ padding: "40px 0" }}>
        <Empty description="Chưa có bác sĩ tại cơ sở này" />
      </div>
    );
  }

  return (
    <div>
      <div style={s.sectionTitle}>
        <span style={s.dot} />
        <h3 style={s.titleText}>Đội ngũ bác sĩ ({doctors.length})</h3>
      </div>
      {doctors.map((doc) => (
        <DoctorCard key={doc.id} doc={doc} />
      ))}
    </div>
  );
};

const s = {
  sectionTitle: { display: "flex", alignItems: "center", gap: 10, marginBottom: 16 },
  dot: { width: 4, height: 22, borderRadius: 4, background: "linear-gradient(#0a6abf, #1a9fe0)", flexShrink: 0 },
  titleText: { fontSize: 17, fontWeight: 700, color: "#0f172a", margin: 0 },

  card: {
    display: "flex", background: "#fff", borderRadius: 20,
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
    marginBottom: 16, overflow: "hidden",
    border: "1px solid #e8edf3",
    transition: "box-shadow .2s",
  },
  left: { flex: 1, padding: "20px 24px", display: "flex", gap: 16 },
  avatar: { width: 80, height: 80, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "2px solid #eef4ff" },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: 700, color: "#0a6abf", margin: "0 0 6px" },
  bio: { fontSize: 13, color: "#475569", lineHeight: 1.6, margin: "0 0 8px", maxWidth: 400 },
  addressRow: { display: "flex", alignItems: "center", gap: 6, marginBottom: 10 },
  addressText: { fontSize: 13, color: "#64748b" },
  detailBtn: {
    background: "#eef4ff", color: "#0a6abf", border: "none",
    borderRadius: 20, padding: "6px 16px", fontSize: 13, fontWeight: 600,
    cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6,
  },

  divider: { width: 1, background: "#f1f5f9", margin: "16px 0" },

  right: { width: 300, flexShrink: 0, padding: "20px 20px" },
  bookingTitle: { fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 12 },
  slots: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 },
  slot: {
    padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 500,
    background: "#f1f5f9", color: "#334155", cursor: "pointer",
    border: "1px solid #e2e8f0", transition: "all .15s",
  },
  slotActive: { background: "#0a6abf", color: "#fff", border: "1px solid #0a6abf" },
  hint: { fontSize: 11, color: "#94a3b8", margin: "4px 0 12px" },
  price: { fontSize: 13, color: "#475569", marginBottom: 12 },
  priceNum: { fontWeight: 700, color: "#e53e3e", fontSize: 14 },
  bookBtn: {
    width: "100%", padding: "10px 0", borderRadius: 10,
    background: "#0a6abf", color: "#fff", border: "none",
    fontSize: 14, fontWeight: 700, cursor: "pointer",
  },
  bookBtnDisabled: { background: "#e2e8f0", color: "#0a6abf" },
};

export default DoctorListByHospitalId;