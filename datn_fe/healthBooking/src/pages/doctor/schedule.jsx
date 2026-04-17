import { useEffect, useState } from "react";
import { Avatar, Select, DatePicker, message } from "antd";
import dayjs from "dayjs";
import {
  cancelAppointmentAPI,
  confirmAppointmentAPI,
  doneAppointmentAPI,
  getDoctorAppointmentsAPI,
} from "../../services/api.service.appointment";

const STATUS_CONFIG = {
  PENDING:   { label: "Chờ xác nhận", color: "#f59e0b", bg: "#fffbeb" },
  CONFIRMED: { label: "Đã xác nhận",  color: "#0a6abf", bg: "#eef4ff" },
  DONE:      { label: "Đã khám xong", color: "#0e9a57", bg: "#edfaf3" },
  CANCELLED: { label: "Đã hủy",       color: "#ef4444", bg: "#fef2f2" },
};

const getAvatarColor = (name) => {
  const colors = ["#1d4ed8", "#0e9a57", "#f59e0b", "#8b5cf6", "#ef4444", "#0a6abf"];
  return colors[(name?.charCodeAt(0) || 0) % colors.length];
};

const Schedule = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterDate, setFilterDate]     = useState(null);
  const [hoveredRow, setHoveredRow]     = useState(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const res = await getDoctorAppointmentsAPI();
    if (res?.data) setAppointments(res.data);
    setLoading(false);
  };

  const handleAction = async (action, id) => {
    try {
      if (action === "confirm") await confirmAppointmentAPI(id);
      if (action === "done")    await doneAppointmentAPI(id);
      if (action === "cancel")  await cancelAppointmentAPI(id);
      message.success("Cập nhật thành công!");
      loadData();
    } catch {
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const filtered = appointments.filter(a => {
    const matchStatus = filterStatus === "ALL" || a.status === filterStatus;
    const matchDate   = !filterDate || a.appointmentDate === filterDate.format("YYYY-MM-DD");
    return matchStatus && matchDate;
  });

  // Count by status for quick stats
  const counts = {
    PENDING:   appointments.filter(a => a.status === "PENDING").length,
    CONFIRMED: appointments.filter(a => a.status === "CONFIRMED").length,
    DONE:      appointments.filter(a => a.status === "DONE").length,
    CANCELLED: appointments.filter(a => a.status === "CANCELLED").length,
  };

  return (
    <div style={s.page}>

      {/* ── Header ── */}
      <div style={s.pageHeader}>
        <div>
          <h2 style={s.pageTitle}>Lịch khám</h2>
          <p style={s.pageSub}>Quản lý toàn bộ lịch hẹn của bạn</p>
        </div>
        <span style={s.totalBadge}>{filtered.length} lịch</span>
      </div>

      {/* ── Quick Status Badges ── */}
      <div style={s.quickStats}>
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <div
            key={key}
            style={{
              ...s.quickStatItem,
              background: filterStatus === key ? cfg.bg : "#fff",
              borderColor: filterStatus === key ? cfg.color : "#e2e8f0",
              cursor: "pointer",
            }}
            onClick={() => setFilterStatus(prev => prev === key ? "ALL" : key)}
          >
            <span style={{ ...s.quickStatDot, background: cfg.color }} />
            <span style={{ fontSize: 13, color: "#334155", fontWeight: 500 }}>{cfg.label}</span>
            <span style={{ ...s.quickStatCount, background: cfg.bg, color: cfg.color }}>
              {counts[key]}
            </span>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div style={s.filters}>
        <DatePicker
          placeholder="Lọc theo ngày"
          onChange={setFilterDate}
          format="DD/MM/YYYY"
          style={{ width: 180, borderRadius: 10 }}
          allowClear
        />
        <Select
          value={filterStatus}
          onChange={setFilterStatus}
          style={{ width: 190 }}
          options={[
            { value: "ALL",       label: "Tất cả trạng thái" },
            { value: "PENDING",   label: "Chờ xác nhận" },
            { value: "CONFIRMED", label: "Đã xác nhận" },
            { value: "DONE",      label: "Đã khám xong" },
            { value: "CANCELLED", label: "Đã hủy" },
          ]}
        />
      </div>

      {/* ── Table ── */}
      <div style={s.card}>
        <div style={s.thead}>
          <span style={{ flex: 2.2 }}>Bệnh nhân</span>
          <span style={{ flex: 1.2 }}>Ngày khám</span>
          <span style={{ flex: 1   }}>Giờ khám</span>
          <span style={{ flex: 1   }}>Giá khám</span>
          <span style={{ flex: 1   }}>Trạng thái</span>
          <span style={{ flex: 1.5, textAlign: "right" }}>Hành động</span>
        </div>

        {loading ? (
          <div style={s.empty}>
            <div style={s.loadingDots}>
              <span /><span /><span />
            </div>
            <p style={{ margin: 0, color: "#94a3b8", fontSize: 14 }}>Đang tải dữ liệu...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={s.empty}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#334155" }}>
              Không có lịch khám nào
            </p>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "#94a3b8" }}>
              Thử thay đổi bộ lọc để xem thêm
            </p>
          </div>
        ) : (
          filtered.map(apt => {
            const cfg = STATUS_CONFIG[apt.status] || STATUS_CONFIG.PENDING;
            return (
              <div
                key={apt.id}
                style={{
                  ...s.row,
                  background: hoveredRow === apt.id ? "#fafbff" : "#fff",
                }}
                onMouseEnter={() => setHoveredRow(apt.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                {/* Patient */}
                <div style={{ flex: 2.2, display: "flex", alignItems: "center", gap: 12 }}>
                  <Avatar style={{ background: getAvatarColor(apt.patientName), flexShrink: 0 }}>
                    {apt.patientName?.charAt(0)}
                  </Avatar>
                  <div>
                    <div style={s.pname}>{apt.patientName}</div>
                    <div style={s.pemail}>{apt.patientEmail}</div>
                  </div>
                </div>

                {/* Date */}
                <span style={{ flex: 1.2, fontSize: 13, color: "#334155" }}>
                  {dayjs(apt.appointmentDate).format("DD/MM/YYYY")}
                </span>

                {/* Time */}
                <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#0a6abf" }}>
                  {apt.timeSlot}
                </span>

                {/* Price */}
                <span style={{ flex: 1, fontSize: 13, color: "#e53e3e", fontWeight: 600 }}>
                  {apt.price ? `${Number(apt.price).toLocaleString("vi-VN")}đ` : "—"}
                </span>

                {/* Status */}
                <div style={{ flex: 1 }}>
                  <span style={{ ...s.badge, background: cfg.bg, color: cfg.color }}>
                    {cfg.label}
                  </span>
                </div>

                {/* Actions */}
                <div style={{ flex: 1.5, display: "flex", justifyContent: "flex-end", gap: 8 }}>
                  {apt.status === "PENDING" && (
                    <button style={s.btnConfirm} onClick={() => handleAction("confirm", apt.id)}>
                      Xác nhận
                    </button>
                  )}
                  {apt.status === "CONFIRMED" && (
                    <button style={s.btnDone} onClick={() => handleAction("done", apt.id)}>
                      Hoàn thành
                    </button>
                  )}
                  {(apt.status === "PENDING" || apt.status === "CONFIRMED") && (
                    <button style={s.btnCancel} onClick={() => handleAction("cancel", apt.id)}>
                      Hủy
                    </button>
                  )}
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
  page:       { padding: "32px 36px", background: "#f0f4f8", minHeight: "100vh" },
  pageHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  pageTitle:  { fontSize: 24, fontWeight: 700, color: "#0f172a", margin: 0 },
  pageSub:    { fontSize: 13, color: "#94a3b8", margin: "4px 0 0" },
  totalBadge: {
    background: "#eef4ff", color: "#0a6abf",
    fontSize: 13, fontWeight: 600, padding: "4px 14px", borderRadius: 20,
    marginTop: 4,
  },

  quickStats: { display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" },
  quickStatItem: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "8px 14px", borderRadius: 10,
    border: "1.5px solid", transition: "all .15s",
  },
  quickStatDot:   { width: 8, height: 8, borderRadius: "50%", flexShrink: 0 },
  quickStatCount: { fontSize: 12, fontWeight: 700, padding: "2px 8px", borderRadius: 20 },

  filters: { display: "flex", gap: 12, marginBottom: 16 },

  card:  { background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.05)", overflow: "hidden" },
  thead: {
    display: "flex", alignItems: "center",
    padding: "13px 20px", background: "#f8fafc",
    fontSize: 11, fontWeight: 600, color: "#94a3b8",
    textTransform: "uppercase", letterSpacing: ".5px",
    borderBottom: "1px solid #f1f5f9",
  },
  row: {
    display: "flex", alignItems: "center",
    padding: "15px 20px", borderBottom: "1px solid #f8fafc",
    transition: "background .12s",
  },

  pname:  { fontSize: 14, fontWeight: 600, color: "#0f172a" },
  pemail: { fontSize: 12, color: "#94a3b8", marginTop: 2 },
  badge:  { fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 20 },

  btnConfirm: {
    padding: "6px 14px", borderRadius: 8, border: "none",
    background: "#0a6abf", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer",
  },
  btnDone: {
    padding: "6px 14px", borderRadius: 8, border: "none",
    background: "#edfaf3", color: "#0e9a57", fontSize: 12, fontWeight: 600, cursor: "pointer",
  },
  btnCancel: {
    padding: "6px 14px", borderRadius: 8, border: "none",
    background: "#fef2f2", color: "#ef4444", fontSize: 12, fontWeight: 600, cursor: "pointer",
  },

  empty: { padding: "48px 24px", textAlign: "center" },
  loadingDots: { marginBottom: 12 },
};

export default Schedule;