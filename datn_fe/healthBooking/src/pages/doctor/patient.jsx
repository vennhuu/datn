import { useEffect, useState } from "react";
import { Avatar, Modal, Input, DatePicker, Form, message, Tooltip } from "antd";
import { SearchOutlined, FileTextOutlined, SendOutlined, CheckCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { getDonePatientsAPI, sendMedicalRecordAPI } from "../../services/api.service.appointment";

const getAvatarColor = (name) => {
  const colors = ["#1d4ed8", "#0e9a57", "#f59e0b", "#8b5cf6", "#ef4444", "#0a6abf"];
  return colors[(name?.charCodeAt(0) || 0) % colors.length];
};

const ListPatient = () => {
  const [patients, setPatients]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [modalOpen, setModalOpen]     = useState(false);
  const [selectedPt, setSelectedPt]   = useState(null);
  const [sending, setSending]         = useState(false);
  const [sentIds, setSentIds]         = useState(new Set()); // track đã gửi
  const [hoveredRow, setHoveredRow]   = useState(null);
  const [form] = Form.useForm();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getDonePatientsAPI();
      if (res?.data) setPatients(res.data);
    } catch {
      message.error("Không thể tải danh sách bệnh nhân");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (patient) => {
    setSelectedPt(patient);
    // Pre-fill nếu đã có chẩn đoán từ appointment
    form.setFieldsValue({
      diagnosis: patient.diagnosis || "",
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedPt(null);
    form.resetFields();
  };

  const handleSend = async () => {
    try {
      const values = await form.validateFields();
      setSending(true);

      await sendMedicalRecordAPI({
        appointmentId: selectedPt.id,
        patientId:     selectedPt.patientId,
        diagnosis:     values.diagnosis,
        symptoms:      values.symptoms    || "",
        prescription:  values.prescription|| "",
        notes:         values.notes       || "",
        revisitDate:   values.revisitDate?.format("YYYY-MM-DD") || null,
      });

      message.success(`Đã gửi bệnh án đến ${selectedPt.patientName}`);
      setSentIds(prev => new Set([...prev, selectedPt.id]));
      closeModal();
    } catch (err) {
      if (err?.errorFields) return; // lỗi validate
      message.error("Gửi bệnh án thất bại, thử lại sau!");
    } finally {
      setSending(false);
    }
  };

  const filtered = patients.filter(p =>
    p.patientName?.toLowerCase().includes(search.toLowerCase()) ||
    p.patientEmail?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={s.page}>

      {/* ── Header ── */}
      <div style={s.pageHeader}>
        <div>
          <h2 style={s.pageTitle}>Danh sách bệnh nhân</h2>
          <p style={s.pageSub}>Bệnh nhân đã được khám xong</p>
        </div>
        <span style={s.totalBadge}>{filtered.length} bệnh nhân</span>
      </div>

      {/* ── Search ── */}
      <div style={s.toolbar}>
        <div style={s.searchWrap}>
          <SearchOutlined style={{ color: "#94a3b8", fontSize: 14 }} />
          <input
            style={s.searchInput}
            placeholder="Tìm theo tên hoặc email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ── Table ── */}
      <div style={s.card}>
        <div style={s.thead}>
          <span style={{ flex: 2.2 }}>Bệnh nhân</span>
          <span style={{ flex: 1.2 }}>Ngày khám</span>
          <span style={{ flex: 1   }}>Giờ khám</span>
          <span style={{ flex: 1.8 }}>Chẩn đoán</span>
          <span style={{ flex: 1   }}>Trạng thái</span>
          <span style={{ flex: 1, textAlign: "right" }}>Hành động</span>
        </div>

        {loading ? (
          <div style={s.empty}>
            <p style={{ color: "#94a3b8", fontSize: 14 }}>Đang tải dữ liệu...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={s.empty}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>👤</div>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#334155" }}>
              {search ? "Không tìm thấy bệnh nhân nào" : "Chưa có bệnh nhân nào"}
            </p>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "#94a3b8" }}>
              {search ? "Thử tìm kiếm với từ khóa khác" : "Bệnh nhân sẽ xuất hiện sau khi bạn hoàn thành khám"}
            </p>
          </div>
        ) : (
          filtered.map(p => {
            const alreadySent = sentIds.has(p.id);
            return (
              <div
                key={p.id}
                style={{
                  ...s.row,
                  background: hoveredRow === p.id ? "#fafbff" : "#fff",
                }}
                onMouseEnter={() => setHoveredRow(p.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                {/* Patient info */}
                <div style={{ flex: 2.2, display: "flex", alignItems: "center", gap: 12 }}>
                  <Avatar
                    size={40}
                    style={{ background: getAvatarColor(p.patientName), flexShrink: 0 }}
                  >
                    {p.patientName?.charAt(0)}
                  </Avatar>
                  <div>
                    <div style={s.pname}>{p.patientName}</div>
                    <div style={s.pemail}>{p.patientEmail}</div>
                  </div>
                </div>

                {/* Date */}
                <span style={{ flex: 1.2, fontSize: 13, color: "#334155" }}>
                  {p.appointmentDate ? dayjs(p.appointmentDate).format("DD/MM/YYYY") : "—"}
                </span>

                {/* Time */}
                <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#0a6abf" }}>
                  {p.timeSlot || "—"}
                </span>

                {/* Diagnosis */}
                <Tooltip title={p.diagnosis || ""}>
                  <span style={{ flex: 1.8, fontSize: 13, color: "#334155", ...s.truncate }}>
                    {p.diagnosis || <span style={{ color: "#cbd5e1" }}>Chưa có</span>}
                  </span>
                </Tooltip>

                {/* Status */}
                <div style={{ flex: 1 }}>
                  <span style={s.doneBadge}>Đã khám xong</span>
                </div>

                {/* Action */}
                <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
                  {alreadySent ? (
                    <span style={s.sentTag}>
                      <CheckCircleOutlined style={{ fontSize: 12 }} />
                      Đã gửi
                    </span>
                  ) : (
                    <button style={s.btnRecord} onClick={() => openModal(p)}>
                      <FileTextOutlined style={{ fontSize: 12 }} />
                      Gửi bệnh án
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Modal Gửi Bệnh Án ── */}
      <Modal
        open={modalOpen}
        onCancel={closeModal}
        footer={null}
        width={580}
        closeIcon={<span style={s.closeIcon}>✕</span>}
        title={
          <div style={{ paddingBottom: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <div style={{ ...s.modalAvt, background: getAvatarColor(selectedPt?.patientName) }}>
                {selectedPt?.patientName?.charAt(0)}
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
                  Gửi bệnh án
                </div>
                <div style={{ fontSize: 13, color: "#94a3b8", fontWeight: 400 }}>
                  {selectedPt?.patientName} · {selectedPt?.appointmentDate
                    ? dayjs(selectedPt.appointmentDate).format("DD/MM/YYYY")
                    : ""}
                </div>
              </div>
            </div>
          </div>
        }
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Form.Item
              label="Chẩn đoán"
              name="diagnosis"
              rules={[{ required: true, message: "Vui lòng nhập chẩn đoán" }]}
            >
              <Input placeholder="VD: Viêm họng cấp, Cảm cúm..." style={{ borderRadius: 10 }} />
            </Form.Item>
            <Form.Item label="Ngày tái khám" name="revisitDate">
              <DatePicker
                format="DD/MM/YYYY"
                style={{ width: "100%", borderRadius: 10 }}
                placeholder="Chọn ngày"
                disabledDate={d => d && d < dayjs().startOf("day")}
              />
            </Form.Item>
          </div>

          <Form.Item label="Triệu chứng" name="symptoms">
            <Input
              placeholder="Mô tả triệu chứng của bệnh nhân"
              style={{ borderRadius: 10 }}
            />
          </Form.Item>

          <Form.Item label="Đơn thuốc" name="prescription">
            <Input.TextArea
              rows={3}
              placeholder="Liệt kê tên thuốc, liều dùng, cách uống..."
              style={{ borderRadius: 10 }}
            />
          </Form.Item>

          <Form.Item label="Ghi chú bác sĩ" name="notes" style={{ marginBottom: 20 }}>
            <Input.TextArea
              rows={2}
              placeholder="Hướng dẫn chăm sóc, kiêng khem, lưu ý sau khám..."
              style={{ borderRadius: 10 }}
            />
          </Form.Item>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button style={s.btnModalCancel} type="button" onClick={closeModal}>
              Hủy
            </button>
            <button
              style={{ ...s.btnModalSend, opacity: sending ? 0.7 : 1 }}
              type="button"
              onClick={handleSend}
              disabled={sending}
            >
              <SendOutlined style={{ fontSize: 13 }} />
              {sending ? "Đang gửi..." : "Gửi bệnh án"}
            </button>
          </div>
        </Form>
      </Modal>
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
    fontSize: 13, fontWeight: 600, padding: "4px 14px", borderRadius: 20, marginTop: 4,
  },

  toolbar:    { marginBottom: 16 },
  searchWrap: {
    display: "flex", alignItems: "center", gap: 10,
    background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 12,
    padding: "8px 16px", width: 320, transition: "border-color .15s",
  },
  searchInput: {
    flex: 1, border: "none", outline: "none",
    fontSize: 13, color: "#0f172a", background: "transparent",
  },

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
    padding: "14px 20px", borderBottom: "1px solid #f8fafc",
    transition: "background .12s",
  },

  pname:  { fontSize: 14, fontWeight: 600, color: "#0f172a" },
  pemail: { fontSize: 12, color: "#94a3b8", marginTop: 2 },
  truncate: {
    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
    paddingRight: 8,
  },

  doneBadge: {
    fontSize: 11, fontWeight: 600, padding: "4px 10px",
    borderRadius: 20, background: "#edfaf3", color: "#0e9a57",
  },
  sentTag: {
    display: "flex", alignItems: "center", gap: 5,
    fontSize: 12, fontWeight: 600, color: "#0e9a57",
    background: "#edfaf3", padding: "6px 14px", borderRadius: 8,
  },
  btnRecord: {
    display: "flex", alignItems: "center", gap: 6,
    padding: "7px 16px", borderRadius: 9, border: "none",
    background: "#0a6abf", color: "#fff",
    fontSize: 12, fontWeight: 600, cursor: "pointer",
    transition: "background .12s",
  },

  closeIcon: {
    fontSize: 13, color: "#94a3b8",
    background: "#f1f5f9", padding: "4px 8px", borderRadius: 6,
  },
  modalAvt: {
    width: 38, height: 38, borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff", fontWeight: 700, fontSize: 15, flexShrink: 0,
  },

  btnModalCancel: {
    padding: "9px 20px", borderRadius: 10,
    border: "1.5px solid #e2e8f0", background: "#fff",
    color: "#64748b", fontSize: 13, fontWeight: 500, cursor: "pointer",
  },
  btnModalSend: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "9px 20px", borderRadius: 10, border: "none",
    background: "#0a6abf", color: "#fff",
    fontSize: 13, fontWeight: 600, cursor: "pointer",
  },

  empty: { padding: "48px 24px", textAlign: "center" },
};

export default ListPatient;