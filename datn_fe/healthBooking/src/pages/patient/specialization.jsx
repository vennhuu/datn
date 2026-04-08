import { useState } from "react";
import { useNavigate } from "react-router-dom";

const specialties = [
  { key: "INTERNAL_MEDICINE", name: "Nội tổng quát", icon: "💊", desc: "Khám và điều trị bệnh nội khoa tổng quát" },
  { key: "SURGERY", name: "Ngoại khoa", icon: "🔪", desc: "Phẫu thuật và can thiệp ngoại khoa" },
  { key: "OBSTETRICS", name: "Sản phụ khoa", icon: "🤰", desc: "Chăm sóc sức khỏe phụ nữ và thai sản" },
  { key: "PEDIATRICS", name: "Nhi khoa", icon: "👶", desc: "Khám và điều trị bệnh cho trẻ em" },
  { key: "CARDIOLOGY", name: "Tim mạch", icon: "❤️", desc: "Chẩn đoán và điều trị bệnh tim mạch" },
  { key: "DERMATOLOGY", name: "Da liễu", icon: "🧴", desc: "Điều trị các bệnh về da và thẩm mỹ da" },
  { key: "ENT", name: "Tai mũi họng", icon: "👂", desc: "Khám và điều trị tai, mũi, họng" },
  { key: "OPHTHALMOLOGY", name: "Mắt", icon: "👁️", desc: "Chăm sóc và điều trị bệnh về mắt" },
  { key: "NEUROLOGY", name: "Thần kinh", icon: "🧠", desc: "Điều trị bệnh thần kinh và não bộ" },
  { key: "ORTHOPEDICS", name: "Cơ xương khớp", icon: "🦴", desc: "Điều trị bệnh xương, khớp, cơ bắp" },
  { key: "GASTROENTEROLOGY", name: "Tiêu hóa", icon: "🍽️", desc: "Chẩn đoán bệnh dạ dày, tiêu hóa" },
  { key: "ENDOCRINOLOGY", name: "Nội tiết", icon: "⚗️", desc: "Điều trị rối loạn nội tiết tố" },
  { key: "PULMONOLOGY", name: "Hô hấp", icon: "🫁", desc: "Điều trị bệnh phổi và đường hô hấp" },
  { key: "PSYCHOLOGY", name: "Tâm lý", icon: "🙂", desc: "Tư vấn và điều trị sức khỏe tâm thần" },
];

const Specialization = () => {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const handleClick = (spec) => {
    setSelected(spec);
  };

  const handleViewAllDoctors = () => {
    if (!selected) return;
    const key = selected.key;
    setSelected(null);
    navigate(`/doctors?specialization=${key}`);
  };

  return (
    <>
      <div style={s.page}>
        {/* Page header */}
        <div style={s.pageHeader}>
          <h1 style={s.pageTitle}>Dịch vụ chuyên khoa</h1>
          <p style={s.pageSub}>
            Chọn chuyên khoa để tìm bác sĩ phù hợp với nhu cầu của bạn
          </p>
        </div>

        {/* Grid */}
        <div style={s.content}>
          <div style={s.grid}>
            {specialties.map((item) => (
              <div
                key={item.key}
                style={{
                  ...s.card,
                  ...(selected && selected.key === item.key ? s.cardActive : {}),
                }}
                onClick={() => handleClick(item)}
                onMouseEnter={(e) => {
                  if (!selected || selected.key !== item.key) {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "0 10px 28px rgba(10,106,191,0.11)";
                    e.currentTarget.style.borderColor = "#c2dcf5";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!selected || selected.key !== item.key) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.05)";
                    e.currentTarget.style.borderColor = "#e8edf3";
                  }
                }}
              >
                <div style={{
                  ...s.iconBox,
                  background: selected && selected.key === item.key ? "#0a6abf" : "#eef4ff",
                }}>
                  <span style={s.icon}>{item.icon}</span>
                </div>
                <div style={s.cardText}>
                  <div style={{
                    ...s.cardName,
                    color: selected && selected.key === item.key ? "#0a6abf" : "#1e2d3d",
                  }}>
                    {item.name}
                  </div>
                  <div style={s.cardDesc}>{item.desc}</div>
                </div>
                <div style={{
                  ...s.arrow,
                  opacity: selected && selected.key === item.key ? 1 : 0,
                }}>→</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slide-in panel */}
      {selected && (
        <>
          {/* Backdrop */}
          <div style={s.backdrop} onClick={() => setSelected(null)} />

          {/* Panel */}
          <div style={s.panel}>
            {/* Panel header */}
            <div style={s.panelHeader}>
              <div style={s.panelHeaderLeft}>
                <div style={s.panelIcon}>{selected.icon}</div>
                <div>
                  <h2 style={s.panelTitle}>{selected.name}</h2>
                  <p style={s.panelSub}>{selected.desc}</p>
                </div>
              </div>
              <button
                style={s.closeBtn}
                onClick={() => setSelected(null)}
              >
                ✕
              </button>
            </div>

            {/* Quick stats */}
            <div style={s.statsRow}>
              <div style={s.statBox}>
                <div style={s.statNum}>20+</div>
                <div style={s.statLabel}>Bác sĩ</div>
              </div>
              <div style={s.statBox}>
                <div style={s.statNum}>4.8★</div>
                <div style={s.statLabel}>Đánh giá</div>
              </div>
              <div style={s.statBox}>
                <div style={s.statNum}>500+</div>
                <div style={s.statLabel}>Lượt khám</div>
              </div>
            </div>

            {/* Info */}
            <div style={s.panelInfo}>
              <div style={s.infoItem}>
                <span style={s.infoIcon}>📋</span>
                <div>
                  <div style={s.infoLabel}>Về chuyên khoa</div>
                  <div style={s.infoVal}>{selected.desc}</div>
                </div>
              </div>
              <div style={s.infoItem}>
                <span style={s.infoIcon}>⏰</span>
                <div>
                  <div style={s.infoLabel}>Giờ làm việc</div>
                  <div style={s.infoVal}>Thứ 2 – Thứ 7 &nbsp;|&nbsp; 7:30 – 17:00</div>
                </div>
              </div>
              <div style={s.infoItem}>
                <span style={s.infoIcon}>💰</span>
                <div>
                  <div style={s.infoLabel}>Chi phí khám</div>
                  <div style={s.infoVal}>200,000 – 500,000 VNĐ</div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div style={s.panelFooter}>
              <button
                style={s.viewBtn}
                onClick={handleViewAllDoctors}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#0858a0")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#0a6abf")}
              >
                Xem tất cả bác sĩ khoa {selected.name} →
              </button>
              <button
                style={s.cancelBtn}
                onClick={() => setSelected(null)}
              >
                Đóng
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

const s = {
  page: {
    background: "#f0f4f8",
    minHeight: "100vh",
  },
  pageHeader: {
    background: "linear-gradient(135deg, #0a3d6b 0%, #0a6abf 60%, #1a9fe0 100%)",
    padding: "40px 80px 52px",
    marginBottom: -20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 700,
    color: "#fff",
    margin: "0 0 8px",
    letterSpacing: "-0.4px",
  },
  pageSub: {
    fontSize: 15,
    color: "#b8d9f2",
    margin: 0,
  },
  content: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "0 80px 60px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 14,
  },
  card: {
    background: "#fff",
    borderRadius: 14,
    border: "1px solid #e8edf3",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    padding: "18px 20px",
    display: "flex",
    alignItems: "center",
    gap: 16,
    cursor: "pointer",
    transition: "transform .15s, box-shadow .15s, border-color .15s",
  },
  cardActive: {
    borderColor: "#0a6abf",
    boxShadow: "0 10px 28px rgba(10,106,191,0.14)",
    transform: "translateY(-2px)",
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 13,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "background .15s",
  },
  icon: { fontSize: 26 },
  cardText: { flex: 1 },
  cardName: {
    fontSize: 15,
    fontWeight: 700,
    marginBottom: 4,
    transition: "color .15s",
  },
  cardDesc: {
    fontSize: 12,
    color: "#94a3b8",
    lineHeight: 1.4,
  },
  arrow: {
    fontSize: 18,
    color: "#0a6abf",
    fontWeight: 700,
    transition: "opacity .15s",
    flexShrink: 0,
  },

  /* Backdrop */
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(10,30,53,0.35)",
    zIndex: 200,
  },

  /* Slide panel */
  panel: {
    position: "fixed",
    right: 0,
    top: 0,
    bottom: 0,
    width: 400,
    background: "#fff",
    zIndex: 201,
    display: "flex",
    flexDirection: "column",
    boxShadow: "-8px 0 40px rgba(0,0,0,0.12)",
    overflowY: "auto",
  },
  panelHeader: {
    background: "linear-gradient(135deg, #0a3d6b, #0a6abf)",
    padding: "28px 24px 24px",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  panelHeaderLeft: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },
  panelIcon: {
    width: 52,
    height: 52,
    background: "rgba(255,255,255,0.15)",
    borderRadius: 13,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 26,
    flexShrink: 0,
  },
  panelTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: "#fff",
    margin: "0 0 4px",
  },
  panelSub: {
    fontSize: 12,
    color: "#a8d8ff",
    margin: 0,
    lineHeight: 1.4,
    maxWidth: 220,
  },
  closeBtn: {
    background: "rgba(255,255,255,0.15)",
    border: "none",
    color: "#fff",
    width: 32,
    height: 32,
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: 14,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  statsRow: {
    display: "flex",
    borderBottom: "1px solid #f0f4f8",
  },
  statBox: {
    flex: 1,
    textAlign: "center",
    padding: "18px 0",
    borderRight: "1px solid #f0f4f8",
  },
  statNum: { fontSize: 20, fontWeight: 700, color: "#0a6abf" },
  statLabel: { fontSize: 12, color: "#94a3b8", marginTop: 3 },

  panelInfo: {
    padding: "20px 24px",
    display: "flex",
    flexDirection: "column",
    gap: 16,
    flex: 1,
  },
  infoItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    background: "#f8fafc",
    borderRadius: 12,
    padding: "14px 16px",
    border: "1px solid #f0f4f8",
  },
  infoIcon: { fontSize: 20, flexShrink: 0 },
  infoLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: 4,
  },
  infoVal: { fontSize: 14, color: "#1e2d3d", fontWeight: 500 },

  panelFooter: {
    padding: "16px 24px 24px",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    borderTop: "1px solid #f0f4f8",
  },
  viewBtn: {
    background: "#0a6abf",
    color: "#fff",
    border: "none",
    borderRadius: 11,
    padding: "13px 0",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    transition: "background .15s",
  },
  cancelBtn: {
    background: "#f8fafc",
    color: "#64748b",
    border: "1px solid #e8edf3",
    borderRadius: 11,
    padding: "11px 0",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
  },
};

export default Specialization;