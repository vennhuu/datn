import { useEffect, useState } from "react";
import { Tag, Spin, Avatar } from "antd";
import {
  CalendarOutlined, CheckCircleOutlined,
  ClockCircleOutlined, UserOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { confirmAppointmentAPI, doneAppointmentAPI, getDoctorAppointmentsAPI } from "../../services/api.service.appointment";

const STATUS_CONFIG = {
  PENDING:   { label: "Chờ xác nhận", color: "#f59e0b", bg: "#fffbeb" },
  CONFIRMED: { label: "Đã xác nhận",  color: "#0a6abf", bg: "#eef4ff" },
  DONE:      { label: "Đã khám xong", color: "#0e9a57", bg: "#edfaf3" },
  CANCELLED: { label: "Đã hủy",       color: "#ef4444", bg: "#fef2f2" },
};

const StatCard = ({ icon, label, value, color }) => (
  <div style={{ ...s.statCard, borderTop: `3px solid ${color}` }}>
    <div style={{ ...s.statIcon, background: color + "20", color }}>
      {icon}
    </div>
    <div>
      <div style={s.statValue}>{value}</div>
      <div style={s.statLabel}>{label}</div>
    </div>
  </div>
);

const DashboardDoctor = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const res = await getDoctorAppointmentsAPI();
    if (res?.data) setAppointments(res.data);
    setLoading(false);
  };

  const handleConfirm = async (id) => {
    await confirmAppointmentAPI(id);
    loadData();
  };

  const handleDone = async (id) => {
    await doneAppointmentAPI(id);
    loadData();
  };

  const today = dayjs().format("YYYY-MM-DD");
  const todayApts = appointments.filter(a => a.appointmentDate === today);
  const pending   = appointments.filter(a => a.status === "PENDING").length;
  const confirmed = appointments.filter(a => a.status === "CONFIRMED").length;
  const done      = appointments.filter(a => a.status === "DONE").length;

  if (loading) return <Spin fullscreen />;

  return (
    <div style={s.page}>
      <div style={s.pageHeader}>
        <h2 style={s.pageTitle}>Tổng quan</h2>
        <span style={s.date}>📅 {dayjs().format("dddd, DD/MM/YYYY")}</span>
      </div>

      {/* Stats */}
      <div style={s.statsGrid}>
        <StatCard icon={<CalendarOutlined />}    label="Lịch hôm nay"    value={todayApts.length} color="#0a6abf" />
        <StatCard icon={<ClockCircleOutlined />} label="Chờ xác nhận"    value={pending}          color="#f59e0b" />
        <StatCard icon={<CheckCircleOutlined />} label="Đã xác nhận"     value={confirmed}        color="#0e9a57" />
        <StatCard icon={<UserOutlined />}        label="Đã khám xong"    value={done}             color="#8b5cf6" />
      </div>

      {/* Today's appointments */}
      <div style={s.card}>
        <div style={s.cardHeader}>
          <h3 style={s.cardTitle}>Lịch khám hôm nay</h3>
          <span style={s.cardCount}>{todayApts.length} lịch</span>
        </div>

        {todayApts.length === 0 ? (
          <div style={s.empty}>🎉 Hôm nay không có lịch khám nào</div>
        ) : (
          <div style={s.aptList}>
            {todayApts.map((apt) => {
              const cfg = STATUS_CONFIG[apt.status] || STATUS_CONFIG.PENDING;
              return (
                <div key={apt.id} style={s.aptRow}>
                  <Avatar size={40} style={{ background: "#1d4ed8", flexShrink: 0 }}>
                    {apt.patientName?.charAt(0)}
                  </Avatar>
                  <div style={s.aptInfo}>
                    <div style={s.aptName}>{apt.patientName}</div>
                    <div style={s.aptMeta}>
                      🕐 {apt.timeSlot} · {apt.note || "Không có ghi chú"}
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
                          Đã khám xong
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const s = {
  page: { padding: "32px 36px", background: "#f0f4f8", minHeight: "100vh" },
  pageHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 },
  pageTitle: { fontSize: 24, fontWeight: 700, color: "#0f172a", margin: 0 },
  date: { fontSize: 14, color: "#64748b" },

  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 },
  statCard: {
    background: "#fff", borderRadius: 16, padding: "20px 24px",
    display: "flex", alignItems: "center", gap: 16,
    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
  },
  statIcon: { width: 48, height: 48, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 },
  statValue: { fontSize: 28, fontWeight: 700, color: "#0f172a", lineHeight: 1 },
  statLabel: { fontSize: 13, color: "#64748b", marginTop: 4 },

  card: { background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.05)", overflow: "hidden" },
  cardHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "20px 24px", borderBottom: "1px solid #f1f5f9",
  },
  cardTitle: { fontSize: 16, fontWeight: 700, color: "#0f172a", margin: 0 },
  cardCount: { fontSize: 13, color: "#94a3b8", background: "#f1f5f9", padding: "4px 12px", borderRadius: 20 },

  empty: { padding: "48px 24px", textAlign: "center", color: "#94a3b8", fontSize: 15 },
  aptList: { padding: "0 8px" },
  aptRow: {
    display: "flex", alignItems: "center", gap: 16,
    padding: "16px", borderBottom: "1px solid #f8fafc",
  },
  aptInfo: { flex: 1 },
  aptName: { fontSize: 15, fontWeight: 600, color: "#0f172a", marginBottom: 4 },
  aptMeta: { fontSize: 12, color: "#94a3b8" },
  aptRight: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 },
  statusBadge: { fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20 },
  aptActions: { display: "flex", gap: 8 },
  btnConfirm: {
    padding: "6px 14px", borderRadius: 8, border: "none",
    background: "#0a6abf", color: "#fff", fontSize: 12,
    fontWeight: 600, cursor: "pointer",
  },
  btnDone: {
    padding: "6px 14px", borderRadius: 8, border: "none",
    background: "#edfaf3", color: "#0e9a57", fontSize: 12,
    fontWeight: 600, cursor: "pointer",
  },
};

export default DashboardDoctor;