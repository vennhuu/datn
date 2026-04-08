import { Link } from "react-router-dom";

const DoctorSidebar = ({ doctor, selectedTime, onBook }) => (
  <div style={{ position: "sticky", top: 24 }}>
    <div style={s.card}>
      <div style={s.titleRow}>
        <span style={s.dot} />
        <h3 style={s.title}>Địa chỉ khám</h3>
      </div>

      <Link to={`/hospital/${doctor.hospital?.id}`} style={s.hospitalName}>
        {doctor.hospital?.name}
      </Link>
      <p style={s.address}>{doctor.hospital?.address}</p>

      <div style={s.divider} />

      <div style={s.priceRow}>
        <span style={s.priceLabel}>Giá khám</span>
        <span style={s.price}>
          {doctor.price ? `${Number(doctor.price).toLocaleString("vi-VN")}đ` : "Liên hệ"}
        </span>
      </div>

      {selectedTime && (
        <div style={s.selectedSlot}>
          🕐 Giờ đã chọn: <strong>{selectedTime}</strong>
        </div>
      )}

      <div style={s.divider} />

      {/* <button
        disabled={!selectedTime}
        onClick={onBook}
        style={{ ...s.btn, ...(!selectedTime ? s.btnDisabled : {}) }}
      >
        Đặt lịch ngay
      </button> */}

      {!selectedTime && (
        <p style={s.hint}>Vui lòng chọn giờ khám bên trái</p>
      )}
    </div>
  </div>
);

const s = {
  card: {
    background: "#fff", padding: 24, borderRadius: 20,
    boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
  },
  titleRow: { display: "flex", alignItems: "center", gap: 10, marginBottom: 16 },
  dot: { width: 4, height: 22, borderRadius: 4, background: "linear-gradient(#0a6abf, #1a9fe0)" },
  title: { fontSize: 17, fontWeight: 700, color: "#0f172a", margin: 0 },
  hospitalName: { fontSize: 15, fontWeight: 700, color: "#0a6abf", display: "block", marginBottom: 6 },
  address: { fontSize: 13, color: "#64748b", lineHeight: 1.6, margin: 0 },
  divider: { height: 1, background: "#f1f5f9", margin: "16px 0" },
  priceRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  priceLabel: { fontSize: 13, color: "#94a3b8" },
  price: { fontSize: 17, fontWeight: 700, color: "#e53e3e" },
  selectedSlot: {
    marginTop: 12, padding: "10px 14px", background: "#eef4ff",
    borderRadius: 10, fontSize: 13, color: "#0a6abf",
  },
  btn: {
    width: "100%", padding: "12px 0", borderRadius: 12,
    background: "#0a6abf", color: "#fff", border: "none",
    fontSize: 15, fontWeight: 700, cursor: "pointer", marginTop: 4,
  },
  btnDisabled: { background: "#e2e8f0", color: "#94a3b8", cursor: "not-allowed" },
  hint: { textAlign: "center", fontSize: 12, color: "#94a3b8", margin: "8px 0 0" },
};

export default DoctorSidebar;