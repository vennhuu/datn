import { useEffect, useState } from "react";
import { Avatar, Spin } from "antd";
import {
  CalendarOutlined, CheckCircleOutlined,
  ClockCircleOutlined, UserOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import {
  confirmAppointmentAPI,
  doneAppointmentAPI,
  getDoctorAppointmentsAPI,
} from "../../services/api.service.appointment";

dayjs.locale("vi");

const STATUS_CONFIG = {
  PENDING:   { label: "Chờ xác nhận", color: "#f59e0b", bg: "#fffbeb" },
  CONFIRMED: { label: "Đã xác nhận",  color: "#0a6abf", bg: "#eef4ff" },
  DONE:      { label: "Đã khám xong", color: "#0e9a57", bg: "#edfaf3" },
  CANCELLED: { label: "Đã hủy",       color: "#ef4444", bg: "#fef2f2" },
};

const STAT_DEFS = [
  { key: "today",     icon: <CalendarOutlined />,    label: "Lịch hôm nay",  color: "#0a6abf", bg: "#eef4ff" },
  { key: "pending",   icon: <ClockCircleOutlined />, label: "Chờ xác nhận",  color: "#f59e0b", bg: "#fffbeb" },
  { key: "confirmed", icon: <CheckCircleOutlined />, label: "Đã xác nhận",   color: "#0e9a57", bg: "#edfaf3" },
  { key: "done",      icon: <UserOutlined />,        label: "Đã khám xong",  color: "#8b5cf6", bg: "#f5f3ff" },
];

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Chào buổi sáng";
  if (h < 18) return "Chào buổi chiều";
  return "Chào buổi tối";
};

const getAvatarColor = (name) => {
  const colors = ["#1d4ed8", "#0e9a57", "#f59e0b", "#8b5cf6", "#ef4444", "#0a6abf"];
  return colors[(name?.charCodeAt(0) || 0) % colors.length];
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, color, bg }) => (
  <div style={{ ...s.statCard, borderTop: `3px solid ${color}` }}>
    <div style={{ ...s.statIcon, background: bg, color }}>
      {icon}
    </div>
    <div>
      <div style={s.statVal}>{value}</div>
      <div style={s.statLabel}>{label}</div>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const DashboardDoctor = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")) || {}; }
    catch { return {}; }
  })();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const res = await getDoctorAppointmentsAPI();
    if (res?.data) setAppointments(res.data);
    setLoading(false);
  };

  const handleConfirm = async (id) => { await confirmAppointmentAPI(id); loadData(); };
  const handleDone    = async (id) => { await doneAppointmentAPI(id);    loadData(); };

  const today     = dayjs().format("YYYY-MM-DD");
  const todayApts = appointments.filter(a => a.appointmentDate === today);
  const stats     = {
    today:     todayApts.length,
    pending:   appointments.filter(a => a.status === "PENDING").length,
    confirmed: appointments.filter(a => a.status === "CONFIRMED").length,
    done:      appointments.filter(a => a.status === "DONE").length,
  };

  if (loading) return <Spin fullscreen />;

  return (
    <div style={s.page}>

      {/* ── Welcome Banner ── */}
      <div style={s.banner}>
        <div style={s.bannerLeft}>
          <div style={s.greeting}>
            {getGreeting()}, BS. {user?.name || "Bác sĩ"} 👋
          </div>
          <div style={s.bannerSub}>
            📅 {dayjs().format("dddd, DD/MM/YYYY")}
            {todayApts.length > 0
              ? ` · Hôm nay bạn có ${todayApts.length} lịch khám`
              : " · Hôm nay bạn không có lịch khám"}
          </div>
        </div>
        <div style={s.bannerBadge}>
          <div style={s.bannerBadgeNum}>{todayApts.length}</div>
          <div style={s.bannerBadgeLabel}>Lịch hôm nay</div>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div style={s.statsGrid}>
        {STAT_DEFS.map(def => (
          <StatCard
            key={def.key}
            icon={def.icon}
            label={def.label}
            value={stats[def.key]}
            color={def.color}
            bg={def.bg}
          />
        ))}
      </div>

      {/* ── Today's Schedule ── */}
      <div style={s.card}>
        <div style={s.cardHead}>
          <div>
            <h3 style={s.cardTitle}>Lịch khám hôm nay</h3>
            <p style={s.cardSub}>{dayjs().format("DD/MM/YYYY")}</p>
          </div>
          <span style={s.countBadge}>{todayApts.length} lịch</span>
        </div>

        {todayApts.length === 0 ? (
          <div style={s.empty}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
            <p style={{ fontSize: 15, fontWeight: 600, color: "#334155", margin: 0 }}>
              Hôm nay không có lịch khám nào
            </p>
            <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 6 }}>
              Hãy tận hưởng ngày nghỉ của bạn!
            </p>
          </div>
        ) : (
          todayApts.map(apt => {
            const cfg = STATUS_CONFIG[apt.status] || STATUS_CONFIG.PENDING;
            return (
              <div key={apt.id} style={s.aptRow}>
                <Avatar
                  size={42}
                  style={{ background: getAvatarColor(apt.patientName), flexShrink: 0 }}
                >
                  {apt.patientName?.charAt(0)}
                </Avatar>
                <div style={s.aptInfo}>
                  <div style={s.aptName}>{apt.patientName}</div>
                  <div style={s.aptMeta}>
                    🕐 {apt.timeSlot}
                    {apt.note ? ` · ${apt.note}` : ""}
                  </div>
                </div>
                <div style={s.aptRight}>
                  <span style={{ ...s.statusBadge, background: cfg.bg, color: cfg.color }}>
                    {cfg.label}
                  </span>
                  <div style={s.aptActions}>
                    {apt.status === "PENDING" && (
                      <button style={s.btnConfirm} onClick={() => handleConfirm(apt.id)}>
                        Xác nhận
                      </button>
                    )}
                    {apt.status === "CONFIRMED" && (
                      <button style={s.btnDone} onClick={() => handleDone(apt.id)}>
                        Hoàn thành
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  page: { padding: "32px 36px", background: "#f0f4f8", minHeight: "100vh" },

  banner: {
    background: "linear-gradient(135deg, #0a6abf 0%, #1d4ed8 100%)",
    borderRadius: 20,
    padding: "28px 32px",
    marginBottom: 24,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bannerLeft: {},
  greeting: { fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 8 },
  bannerSub: { fontSize: 14, color: "rgba(255,255,255,0.8)" },
  bannerBadge: {
    background: "rgba(255,255,255,0.15)",
    borderRadius: 16,
    padding: "16px 28px",
    textAlign: "center",
  },
  bannerBadgeNum:   { fontSize: 36, fontWeight: 700, color: "#fff", lineHeight: 1 },
  bannerBadgeLabel: { fontSize: 12, color: "rgba(255,255,255,0.8)", marginTop: 4 },

  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 },
  statCard: {
    background: "#fff",
    borderRadius: 16,
    padding: "20px 22px",
    display: "flex",
    alignItems: "center",
    gap: 16,
    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    flexShrink: 0,
  },
  statVal:   { fontSize: 28, fontWeight: 700, color: "#0f172a", lineHeight: 1 },
  statLabel: { fontSize: 12, color: "#94a3b8", marginTop: 4 },

  card: {
    background: "#fff",
    borderRadius: 20,
    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
    overflow: "hidden",
  },
  cardHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 24px",
    borderBottom: "1px solid #f1f5f9",
  },
  cardTitle: { fontSize: 16, fontWeight: 700, color: "#0f172a", margin: 0 },
  cardSub:   { fontSize: 12, color: "#94a3b8", margin: "4px 0 0" },
  countBadge: {
    fontSize: 13, color: "#94a3b8",
    background: "#f1f5f9", padding: "4px 14px", borderRadius: 20,
  },

  empty: { padding: "48px 24px", textAlign: "center" },

  aptRow: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    padding: "16px 24px",
    borderBottom: "1px solid #f8fafc",
  },
  aptInfo: { flex: 1 },
  aptName: { fontSize: 15, fontWeight: 600, color: "#0f172a", marginBottom: 4 },
  aptMeta: { fontSize: 12, color: "#94a3b8" },
  aptRight: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 },
  statusBadge: { fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20 },
  aptActions: { display: "flex", gap: 8 },
  btnConfirm: {
    padding: "6px 14px", borderRadius: 8, border: "none",
    background: "#0a6abf", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer",
  },
  btnDone: {
    padding: "6px 14px", borderRadius: 8, border: "none",
    background: "#edfaf3", color: "#0e9a57", fontSize: 12, fontWeight: 600, cursor: "pointer",
  },
};

export default DashboardDoctor;