import { useEffect, useState } from "react";
import { Avatar, Select, DatePicker } from "antd";
import dayjs from "dayjs";
import { cancelAppointmentAPI, confirmAppointmentAPI, doneAppointmentAPI, getDoctorAppointmentsAPI } from "../../services/api.service.appointment";

const STATUS_CONFIG = {
  PENDING:   { label: "Chờ xác nhận", color: "#f59e0b", bg: "#fffbeb" },
  CONFIRMED: { label: "Đã xác nhận",  color: "#0a6abf", bg: "#eef4ff" },
  DONE:      { label: "Đã khám xong", color: "#0e9a57", bg: "#edfaf3" },
  CANCELLED: { label: "Đã hủy",       color: "#ef4444", bg: "#fef2f2" },
};

const Schedule = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterDate, setFilterDate] = useState(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const res = await getDoctorAppointmentsAPI();
    if (res?.data) setAppointments(res.data);
    setLoading(false);
  };

  const handleAction = async (action, id) => {
    if (action === "confirm") await confirmAppointmentAPI(id);
    if (action === "done")    await doneAppointmentAPI(id);
    if (action === "cancel")  await cancelAppointmentAPI(id);
    loadData();
  };

  const filtered = appointments.filter((a) => {
    const matchStatus = filterStatus === "ALL" || a.status === filterStatus;
    const matchDate = !filterDate || a.appointmentDate === filterDate.format("YYYY-MM-DD");
    return matchStatus && matchDate;
  });

  return (
    <div style={s.page}>
      <div style={s.pageHeader}>
        <h2 style={s.pageTitle}>Lịch khám</h2>
        <span style={s.total}>{filtered.length} lịch</span>
      </div>

      {/* Filters */}
      <div style={s.filters}>
        <DatePicker
          placeholder="Lọc theo ngày"
          onChange={setFilterDate}
          format="DD/MM/YYYY"
          style={{ width: 180 }}
          allowClear
        />
        <Select
          value={filterStatus}
          onChange={setFilterStatus}
          style={{ width: 180 }}
          options={[
            { value: "ALL",      label: "Tất cả trạng thái" },
            { value: "PENDING",  label: "Chờ xác nhận" },
            { value: "CONFIRMED",label: "Đã xác nhận" },
            { value: "DONE",     label: "Đã khám xong" },
            { value: "CANCELLED",label: "Đã hủy" },
          ]}
        />
      </div>

      {/* Table */}
      <div style={s.card}>
        {/* Header */}
        <div style={s.tableHeader}>
          <span style={{ flex: 2 }}>Bệnh nhân</span>
          <span style={{ flex: 1 }}>Ngày khám</span>
          <span style={{ flex: 1 }}>Giờ khám</span>
          <span style={{ flex: 1 }}>Giá khám</span>
          <span style={{ flex: 1 }}>Trạng thái</span>
          <span style={{ flex: 1.5, textAlign: "right" }}>Hành động</span>
        </div>

        {loading ? (
          <div style={s.empty}>Đang tải...</div>
        ) : filtered.length === 0 ? (
          <div style={s.empty}>Không có lịch khám nào</div>
        ) : (
          filtered.map((apt) => {
            const cfg = STATUS_CONFIG[apt.status] || STATUS_CONFIG.PENDING;
            return (
              <div key={apt.id} style={s.row}>
                {/* Patient */}
                <div style={{ flex: 2, display: "flex", alignItems: "center", gap: 12 }}>
                  <Avatar style={{ background: "#1d4ed8", flexShrink: 0 }}>
                    {apt.patientName?.charAt(0)}
                  </Avatar>
                  <div>
                    <div style={s.patientName}>{apt.patientName}</div>
                    <div style={s.patientEmail}>{apt.patientEmail}</div>
                  </div>
                </div>

                {/* Date */}
                <span style={{ flex: 1, fontSize: 14, color: "#334155" }}>
                  {dayjs(apt.appointmentDate).format("DD/MM/YYYY")}
                </span>

                {/* Time */}
                <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "#0a6abf" }}>
                  {apt.timeSlot}
                </span>

                {/* Price */}
                <span style={{ flex: 1, fontSize: 14, color: "#e53e3e", fontWeight: 600 }}>
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

const s = {
  page: { padding: "32px 36px", background: "#f0f4f8", minHeight: "100vh" },
  pageHeader: { display: "flex", alignItems: "center", gap: 16, marginBottom: 24 },
  pageTitle: { fontSize: 24, fontWeight: 700, color: "#0f172a", margin: 0 },
  total: { background: "#eef4ff", color: "#0a6abf", fontSize: 13, fontWeight: 600, padding: "4px 12px", borderRadius: 20 },
  filters: { display: "flex", gap: 12, marginBottom: 20 },

  card: { background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.05)", overflow: "hidden" },
  tableHeader: {
    display: "flex", alignItems: "center",
    padding: "14px 20px", background: "#f8fafc",
    fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase",
    borderBottom: "1px solid #f1f5f9",
  },
  row: {
    display: "flex", alignItems: "center",
    padding: "16px 20px", borderBottom: "1px solid #f8fafc",
    transition: "background .15s",
  },
  patientName: { fontSize: 14, fontWeight: 600, color: "#0f172a" },
  patientEmail: { fontSize: 12, color: "#94a3b8" },
  badge: { fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 20 },

  btnConfirm: { padding: "6px 14px", borderRadius: 8, border: "none", background: "#0a6abf", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" },
  btnDone:    { padding: "6px 14px", borderRadius: 8, border: "none", background: "#edfaf3", color: "#0e9a57", fontSize: 12, fontWeight: 600, cursor: "pointer" },
  btnCancel:  { padding: "6px 14px", borderRadius: 8, border: "none", background: "#fef2f2", color: "#ef4444", fontSize: 12, fontWeight: 600, cursor: "pointer" },

  empty: { padding: "48px 24px", textAlign: "center", color: "#94a3b8", fontSize: 15 },
};

export default Schedule;