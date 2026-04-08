import { useEffect, useState } from "react";
import { Tag, Empty } from "antd";
import { CalendarOutlined, ClockCircleOutlined, MedicineBoxOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { cancelAppointmentAPI, getMyAppointmentsAPI } from "../../services/api.service.appointment";

const STATUS_CONFIG = {
  PENDING:   { label: "Chờ xác nhận", color: "#f59e0b", bg: "#fffbeb" },
  CONFIRMED: { label: "Đã xác nhận",  color: "#0a6abf", bg: "#eef4ff" },
  DONE:      { label: "Đã khám xong", color: "#0e9a57", bg: "#edfaf3" },
  CANCELLED: { label: "Đã hủy",       color: "#ef4444", bg: "#fef2f2" },
};

const FILTER_TABS = [
  { key: "ALL",       label: "Tất cả" },
  { key: "PENDING",   label: "Chờ xác nhận" },
  { key: "CONFIRMED", label: "Đã xác nhận" },
  { key: "DONE",      label: "Đã khám xong" },
  { key: "CANCELLED", label: "Đã hủy" },
];

const AppointmentHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const res = await getMyAppointmentsAPI();
    if (res?.data) setAppointments(res.data);
    setLoading(false);
  };

  const handleCancel = async (id) => {
    setCancelling(id);
    await cancelAppointmentAPI(id);
    await loadData();
    setCancelling(null);
  };

  const filtered = appointments.filter(
    (a) => activeTab === "ALL" || a.status === activeTab
  );

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.pageHeader}>
        <div>
          <h2 style={s.pageTitle}>Lịch sử đặt khám</h2>
          <p style={s.pageSub}>Theo dõi và quản lý các lịch khám của bạn</p>
        </div>
        <div style={s.totalBadge}>
          {appointments.length} lịch khám
        </div>
      </div>

      {/* Filter tabs */}
      <div style={s.tabs}>
        {FILTER_TABS.map((tab) => {
          const count = tab.key === "ALL"
            ? appointments.length
            : appointments.filter((a) => a.status === tab.key).length;
          return (
            <button
              key={tab.key}
              style={{ ...s.tab, ...(activeTab === tab.key ? s.tabActive : {}) }}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              {count > 0 && (
                <span style={{
                  ...s.tabCount,
                  background: activeTab === tab.key ? "#0a6abf" : "#e2e8f0",
                  color: activeTab === tab.key ? "#fff" : "#64748b",
                }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {loading ? (
        <div style={s.skeletonWrap}>
          {[1, 2, 3].map((i) => <div key={i} style={s.skeleton} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div style={s.emptyWrap}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span style={{ color: "#94a3b8" }}>
                Không có lịch khám nào
              </span>
            }
          />
        </div>
      ) : (
        <div style={s.list}>
          {filtered.map((apt) => {
            const cfg = STATUS_CONFIG[apt.status] || STATUS_CONFIG.PENDING;
            const isPast = dayjs(apt.appointmentDate).isBefore(dayjs(), "day");

            return (
              <div key={apt.id} style={s.card}>
                {/* Left accent */}
                <div style={{ ...s.accent, background: cfg.color }} />

                {/* Card body */}
                <div style={s.cardBody}>
                  {/* Top row */}
                  <div style={s.cardTop}>
                    <div style={s.doctorInfo}>
                      <div style={s.avatarCircle}>
                        {apt.doctorName?.charAt(0)}
                      </div>
                      <div>
                        <div style={s.doctorName}>{apt.doctorName}</div>
                        <div style={s.hospitalName}>
                          <MedicineBoxOutlined style={{ fontSize: 11, marginRight: 4 }} />
                          {apt.hospitalName}
                        </div>
                      </div>
                    </div>

                    <span style={{ ...s.statusBadge, background: cfg.bg, color: cfg.color }}>
                      {cfg.label}
                    </span>
                  </div>

                  {/* Divider */}
                  <div style={s.divider} />

                  {/* Bottom row */}
                  <div style={s.cardBottom}>
                    <div style={s.metaGroup}>
                      <div style={s.metaItem}>
                        <CalendarOutlined style={{ color: "#0a6abf", fontSize: 13 }} />
                        <span style={s.metaText}>
                          {dayjs(apt.appointmentDate).format("DD/MM/YYYY")}
                          {!isPast && apt.status !== "CANCELLED" && (
                            <span style={s.daysLeft}>
                              {dayjs(apt.appointmentDate).diff(dayjs(), "day") === 0
                                ? " · Hôm nay"
                                : ` · ${dayjs(apt.appointmentDate).diff(dayjs(), "day")} ngày nữa`
                              }
                            </span>
                          )}
                        </span>
                      </div>
                      <div style={s.metaItem}>
                        <ClockCircleOutlined style={{ color: "#0a6abf", fontSize: 13 }} />
                        <span style={s.metaText}>{apt.timeSlot}</span>
                      </div>
                      <div style={s.metaItem}>
                        <span style={s.priceLabel}>Giá khám:</span>
                        <span style={s.price}>
                          {apt.price
                            ? `${Number(apt.price).toLocaleString("vi-VN")}đ`
                            : "Liên hệ"}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={s.actions}>
                      {(apt.status === "PENDING" || apt.status === "CONFIRMED") && (
                        <button
                          style={{
                            ...s.cancelBtn,
                            opacity: cancelling === apt.id ? 0.6 : 1,
                          }}
                          onClick={() => handleCancel(apt.id)}
                          disabled={cancelling === apt.id}
                        >
                          {cancelling === apt.id ? "Đang hủy..." : "Hủy lịch"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Note */}
                  {apt.note && (
                    <div style={s.note}>
                      📝 {apt.note}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const s = {
  page: { padding: "32px 48px", background: "#f0f4f8", minHeight: "100vh" },

  pageHeader: {
    display: "flex", justifyContent: "space-between",
    alignItems: "flex-start", marginBottom: 24,
  },
  pageTitle: { fontSize: 24, fontWeight: 700, color: "#0f172a", margin: "0 0 4px" },
  pageSub: { fontSize: 14, color: "#64748b", margin: 0 },
  totalBadge: {
    background: "#eef4ff", color: "#0a6abf",
    fontSize: 13, fontWeight: 600,
    padding: "6px 16px", borderRadius: 20,
  },

  tabs: { display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" },
  tab: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "8px 16px", borderRadius: 20, border: "1px solid #e2e8f0",
    background: "#fff", color: "#64748b", fontSize: 13, fontWeight: 500,
    cursor: "pointer", transition: "all .15s",
  },
  tabActive: {
    background: "#eef4ff", color: "#0a6abf",
    border: "1px solid #c2dcf5", fontWeight: 600,
  },
  tabCount: {
    fontSize: 11, fontWeight: 700,
    padding: "1px 7px", borderRadius: 20,
    transition: "all .15s",
  },

  skeletonWrap: { display: "flex", flexDirection: "column", gap: 12 },
  skeleton: { height: 120, background: "#e2e8f0", borderRadius: 16 },

  emptyWrap: {
    background: "#fff", borderRadius: 20,
    padding: "60px 0", textAlign: "center",
    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
  },

  list: { display: "flex", flexDirection: "column", gap: 12 },

  card: {
    display: "flex", background: "#fff", borderRadius: 16,
    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
    overflow: "hidden", border: "1px solid #f1f5f9",
  },
  accent: { width: 4, flexShrink: 0 },
  cardBody: { flex: 1, padding: "18px 20px" },

  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  doctorInfo: { display: "flex", alignItems: "center", gap: 12 },
  avatarCircle: {
    width: 44, height: 44, borderRadius: "50%",
    background: "linear-gradient(135deg, #0a6abf, #1a9fe0)",
    color: "#fff", fontSize: 18, fontWeight: 700,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  doctorName: { fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 3 },
  hospitalName: { fontSize: 12, color: "#64748b" },

  statusBadge: {
    fontSize: 12, fontWeight: 600,
    padding: "4px 12px", borderRadius: 20,
  },

  divider: { height: 1, background: "#f8fafc", margin: "14px 0" },

  cardBottom: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  metaGroup: { display: "flex", gap: 20, flexWrap: "wrap" },
  metaItem: { display: "flex", alignItems: "center", gap: 6 },
  metaText: { fontSize: 13, color: "#334155" },
  daysLeft: { color: "#0a6abf", fontWeight: 600 },
  priceLabel: { fontSize: 13, color: "#94a3b8" },
  price: { fontSize: 14, fontWeight: 700, color: "#e53e3e" },

  actions: { display: "flex", gap: 8 },
  cancelBtn: {
    padding: "7px 16px", borderRadius: 8, border: "none",
    background: "#fef2f2", color: "#ef4444",
    fontSize: 12, fontWeight: 600, cursor: "pointer",
  },

  note: {
    marginTop: 10, padding: "8px 12px",
    background: "#f8fafc", borderRadius: 8,
    fontSize: 12, color: "#64748b",
  },
};

export default AppointmentHistory;