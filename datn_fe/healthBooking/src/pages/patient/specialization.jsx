import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useThemeTokens } from "../../context/themeTokens";
import { Baby, Bone, Brain, Clock, DollarSign, Ear, Eye, FlaskConical, Heart, Info, Scissors, Smile, Sparkles, Stethoscope, UtensilsCrossed, Wind } from "lucide-react";


const specialties = [
  { key: "INTERNAL_MEDICINE", name: "Nội tổng quát",  Icon: Stethoscope,    desc: "Khám và điều trị bệnh nội khoa tổng quát" },
  { key: "SURGERY",           name: "Ngoại khoa",      Icon: Scissors,       desc: "Phẫu thuật và can thiệp ngoại khoa" },
  { key: "OBSTETRICS",        name: "Sản phụ khoa",    Icon: Baby,           desc: "Chăm sóc sức khỏe phụ nữ và thai sản" },
  { key: "PEDIATRICS",        name: "Nhi khoa",        Icon: Smile,          desc: "Khám và điều trị bệnh cho trẻ em" },
  { key: "CARDIOLOGY",        name: "Tim mạch",        Icon: Heart,          desc: "Chẩn đoán và điều trị bệnh tim mạch" },
  { key: "DERMATOLOGY",       name: "Da liễu",         Icon: Sparkles,       desc: "Điều trị các bệnh về da và thẩm mỹ da" },
  { key: "ENT",               name: "Tai mũi họng",   Icon: Ear,            desc: "Khám và điều trị tai, mũi, họng" },
  { key: "OPHTHALMOLOGY",     name: "Mắt",             Icon: Eye,            desc: "Chăm sóc và điều trị bệnh về mắt" },
  { key: "NEUROLOGY",         name: "Thần kinh",       Icon: Brain,          desc: "Điều trị bệnh thần kinh và não bộ" },
  { key: "ORTHOPEDICS",       name: "Cơ xương khớp",  Icon: Bone,           desc: "Điều trị bệnh xương, khớp, cơ bắp" },
  { key: "GASTROENTEROLOGY",  name: "Tiêu hóa",        Icon: UtensilsCrossed,desc: "Chẩn đoán bệnh dạ dày, tiêu hóa" },
  { key: "ENDOCRINOLOGY",     name: "Nội tiết",        Icon: FlaskConical,   desc: "Điều trị rối loạn nội tiết tố" },
  { key: "PULMONOLOGY",       name: "Hô hấp",          Icon: Wind,           desc: "Điều trị bệnh phổi và đường hô hấp" },
  { key: "PSYCHOLOGY",        name: "Tâm lý",          Icon: Brain,          desc: "Tư vấn và điều trị sức khỏe tâm thần" },
];

const panelInfoItems = (selected) => [
  { Icon: Info,        label: "Về chuyên khoa",  val: selected.desc },
  { Icon: Clock,       label: "Giờ làm việc",    val: "Thứ 2 – Thứ 7  |  7:30 – 17:00" },
  { Icon: DollarSign,  label: "Chi phí khám",    val: "200,000 – 500,000 VNĐ" },
];

const Specialization = () => {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();
  const t = useThemeTokens();
  const s = getStyles(t);

  const handleClick = (spec) => setSelected(spec);
  const handleViewAllDoctors = () => {
    if (!selected) return;
    const key = selected.key;
    setSelected(null);
    navigate(`/doctors?specialization=${key}`);
  };

  return (
    <>
      <div style={s.page}>
        <div style={s.pageHeader}>
          <h1 style={s.pageTitle}>Dịch vụ chuyên khoa</h1>
          <p style={s.pageSub}>Chọn chuyên khoa để tìm bác sĩ phù hợp với nhu cầu của bạn</p>
        </div>
        <div style={s.content}>
          <div style={s.grid}>
            {specialties.map((item) => {
              const isActive = selected?.key === item.key;
              return (
                <div
                  key={item.key}
                  style={{ ...s.card, ...(isActive ? s.cardActive : {}) }}
                  onClick={() => handleClick(item)}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.transform = "translateY(-3px)";
                      e.currentTarget.style.boxShadow = "0 10px 28px rgba(10,106,191,0.11)";
                      e.currentTarget.style.borderColor = "#c2dcf5";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = t.isDark
                        ? "0 2px 10px rgba(0,0,0,0.3)"
                        : "0 2px 10px rgba(0,0,0,0.05)";
                      e.currentTarget.style.borderColor = t.border;
                    }
                  }}
                >
                  <div style={{
                    ...s.iconBox,
                    background: isActive ? "#0a6abf" : t.brandBg,
                  }}>
                    <item.Icon
                      size={24}
                      color={isActive ? "#fff" : "#0a6abf"}
                      strokeWidth={1.8}
                    />
                  </div>
                  <div style={s.cardText}>
                    <div style={{
                      ...s.cardName,
                      color: isActive ? "#0a6abf" : t.textPrimary,
                    }}>
                      {item.name}
                    </div>
                    <div style={s.cardDesc}>{item.desc}</div>
                  </div>
                  <div style={{ ...s.arrow, opacity: isActive ? 1 : 0 }}>→</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {selected && (
        <>
          <div style={s.backdrop} onClick={() => setSelected(null)} />
          <div style={s.panel}>
            <div style={s.panelHeader}>
              <div style={s.panelHeaderLeft}>
                <div style={s.panelIcon}>
                  <selected.Icon size={26} color="#fff" strokeWidth={1.8} />
                </div>
                <div>
                  <h2 style={s.panelTitle}>{selected.name}</h2>
                  <p style={s.panelSub}>{selected.desc}</p>
                </div>
              </div>
              <button style={s.closeBtn} onClick={() => setSelected(null)}>✕</button>
            </div>

            <div style={s.statsRow}>
              {[["20+", "Bác sĩ"], ["4.8★", "Đánh giá"], ["500+", "Lượt khám"]].map(([num, label]) => (
                <div key={label} style={s.statBox}>
                  <div style={s.statNum}>{num}</div>
                  <div style={s.statLabel}>{label}</div>
                </div>
              ))}
            </div>

            <div style={s.panelInfo}>
              {panelInfoItems(selected).map(({ Icon, label, val }) => (
                <div key={label} style={s.infoItem}>
                  <Icon size={20} color="#0a6abf" strokeWidth={1.8} style={{ flexShrink: 0 }} />
                  <div>
                    <div style={s.infoLabel}>{label}</div>
                    <div style={s.infoVal}>{val}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={s.panelFooter}>
              <button
                style={s.viewBtn}
                onClick={handleViewAllDoctors}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#0858a0")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#0a6abf")}
              >
                Xem tất cả bác sĩ khoa {selected.name} →
              </button>
              <button style={s.cancelBtn} onClick={() => setSelected(null)}>Đóng</button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

const getStyles = (t) => ({
  page:            { background: t.pageBg, minHeight: "100vh" },
  pageHeader:      { background: "linear-gradient(135deg, #0a3d6b 0%, #0a6abf 60%, #1a9fe0 100%)", padding: "40px 80px 52px", marginBottom: -20 },
  pageTitle:       { fontSize: 28, fontWeight: 700, color: "#fff", margin: "0 0 8px", letterSpacing: "-0.4px" },
  pageSub:         { fontSize: 15, color: "#b8d9f2", margin: 0 },
  content:         { maxWidth: 1100, margin: "0 auto", padding: "0 80px 60px" },
  grid:            { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 },
  card:            { background: t.cardBg, borderRadius: 14, border: `1px solid ${t.border}`, boxShadow: t.isDark ? "0 2px 10px rgba(0,0,0,0.3)" : "0 2px 10px rgba(0,0,0,0.05)", padding: "18px 20px", display: "flex", alignItems: "center", gap: 16, cursor: "pointer", transition: "transform .15s, box-shadow .15s, border-color .15s" },
  cardActive:      { borderColor: "#0a6abf", boxShadow: "0 10px 28px rgba(10,106,191,0.14)", transform: "translateY(-2px)" },
  iconBox:         { width: 52, height: 52, borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background .15s" },
  cardText:        { flex: 1 },
  cardName:        { fontSize: 15, fontWeight: 700, marginBottom: 4, transition: "color .15s" },
  cardDesc:        { fontSize: 12, color: t.textMuted, lineHeight: 1.4 },
  arrow:           { fontSize: 18, color: "#0a6abf", fontWeight: 700, transition: "opacity .15s", flexShrink: 0 },
  backdrop:        { position: "fixed", inset: 0, background: "rgba(10,30,53,0.5)", zIndex: 200 },
  panel:           { position: "fixed", right: 0, top: 0, bottom: 0, width: 400, background: t.cardBg, zIndex: 201, display: "flex", flexDirection: "column", boxShadow: "-8px 0 40px rgba(0,0,0,0.2)", overflowY: "auto" },
  panelHeader:     { background: "linear-gradient(135deg, #0a3d6b, #0a6abf)", padding: "28px 24px 24px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 },
  panelHeaderLeft: { display: "flex", alignItems: "center", gap: 14 },
  panelIcon:       { width: 52, height: 52, background: "rgba(255,255,255,0.15)", borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  panelTitle:      { fontSize: 20, fontWeight: 700, color: "#fff", margin: "0 0 4px" },
  panelSub:        { fontSize: 12, color: "#a8d8ff", margin: 0, lineHeight: 1.4, maxWidth: 220 },
  closeBtn:        { background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", width: 32, height: 32, borderRadius: "50%", cursor: "pointer", fontSize: 14, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" },
  statsRow:        { display: "flex", borderBottom: `1px solid ${t.borderLight}` },
  statBox:         { flex: 1, textAlign: "center", padding: "18px 0", borderRight: `1px solid ${t.borderLight}` },
  statNum:         { fontSize: 20, fontWeight: 700, color: "#0a6abf" },
  statLabel:       { fontSize: 12, color: t.textMuted, marginTop: 3 },
  panelInfo:       { padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16, flex: 1 },
  infoItem:        { display: "flex", alignItems: "flex-start", gap: 12, background: t.mutedBg, borderRadius: 12, padding: "14px 16px", border: `1px solid ${t.borderLight}` },
  infoLabel:       { fontSize: 11, fontWeight: 600, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 },
  infoVal:         { fontSize: 14, color: t.textPrimary, fontWeight: 500 },
  panelFooter:     { padding: "16px 24px 24px", display: "flex", flexDirection: "column", gap: 10, borderTop: `1px solid ${t.borderLight}` },
  viewBtn:         { background: "#0a6abf", color: "#fff", border: "none", borderRadius: 11, padding: "13px 0", fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "background .15s" },
  cancelBtn:       { background: t.mutedBg, color: t.textSecondary, border: `1px solid ${t.border}`, borderRadius: 11, padding: "11px 0", fontSize: 14, fontWeight: 500, cursor: "pointer" },
});

export default Specialization;