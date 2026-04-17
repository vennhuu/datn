import { useEffect, useRef, useState } from "react";
import { DatePicker, Modal, Input, message, Steps, Spin } from "antd";
import {
  createAppointmentAPI,
  getBookedSlotsAPI,
  getAppointmentStatusAPI,
} from "../../../services/api.service.appointment";
import dayjs from "dayjs";

const SCHEDULES = [
  "09:00", "09:30", "10:00", "10:30", "11:00",
  "13:30", "14:00", "14:30", "15:00", "15:30",
];

const BANK_ID = "BIDV";
const ACCOUNT_NO = "5315966788";
const ACCOUNT_NAME = "PHAN HUU PHUOC";

const DoctorBooking = ({ doctor, selectedTime, onSelectTime }) => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [paymentContent, setPaymentContent] = useState("");
  const [currentAppointmentId, setCurrentAppointmentId] = useState(null);
  const [step, setStep] = useState(null); // null | "confirm" | "qr" | "success"
  const [waitingPayment, setWaitingPayment] = useState(false);

  const pollingRef = useRef(null); // dùng ref để clear interval chính xác

  if (!doctor) return null;

  useEffect(() => {
    loadBookedSlots();
  }, [selectedDate, doctor.id]);

  // Cleanup polling khi unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const loadBookedSlots = async () => {
    const res = await getBookedSlotsAPI(doctor.id, selectedDate.format("YYYY-MM-DD"));
    if (res?.data) setBookedSlots(res.data);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    onSelectTime(null);
  };

  //Gọi API tạo lịch khi bấm "Tiếp tục thanh toán"
  const handleCreateAppointment = async () => {
    setLoading(true);
    try {
      const res = await createAppointmentAPI({
        doctorId: doctor.id,
        appointmentDate: selectedDate.format("YYYY-MM-DD"),
        timeSlot: selectedTime,
        note: note,
      });

      if (res?.data) {
        const appointmentId = res.data.id;
        const content = res.data.paymentContent; // "KHAM 12345678"

        setCurrentAppointmentId(appointmentId);
        setPaymentContent(content);
        setStep("qr"); // chuyển sang bước QR
        startPolling(appointmentId); // bắt đầu polling
      } else {
        message.error(res?.message || "Đặt lịch thất bại");
      }
    } catch (err) {
      message.error("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  // Polling mỗi 3 giây để kiểm tra trạng thái thanh toán
  const startPolling = (appointmentId) => {
    setWaitingPayment(true);
    console.log("🔄 Bắt đầu polling appointmentId:", appointmentId);

    pollingRef.current = setInterval(async () => {
      try {
        console.log("📡 Đang poll appointmentId:", appointmentId);
        const res = await getAppointmentStatusAPI(appointmentId);
        console.log("Full res:", res);          // xem toàn bộ
        console.log("res.data:", res?.data);    // xem data layer 1
        
        if (res?.data?.status === "CONFIRMED") {
          clearInterval(pollingRef.current);
          setWaitingPayment(false);
          setStep("success");
          onSelectTime(null);
          setNote("");
          loadBookedSlots();
        }
      } catch (e) {
        console.error("❌ Polling error:", e);
      }
    }, 3000);

    setTimeout(() => {
      clearInterval(pollingRef.current);
      setWaitingPayment(false);
    }, 15 * 60 * 1000);
  };

  const handleCancelModal = () => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    setWaitingPayment(false);
    setStep(null);
  };

  // QR URL dùng paymentContent từ backend
  const qrAmount = doctor.price || 0;
  // const qrUrl =
  //   `https://img.vietqr.io/image/BIDV-${ACCOUNT_NO}-compact2.png` +
  //   `?amount=${qrAmount}` +
  //   `&addInfo=${encodeURIComponent(paymentContent)}` +
  //   `&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;

    const qrUrl = `https://qr.sepay.vn/img?acc=96247PHUOC&bank=BIDV&amount=${qrAmount}&des=${encodeURIComponent(paymentContent)}`
  return (
    <>
      {/* ===== CARD CHỌN LỊCH ===== */}
      <div style={s.card}>
        <div style={s.titleRow}>
          <span style={s.dot} />
          <h3 style={s.title}>Đặt lịch khám</h3>
        </div>

        <DatePicker
          value={selectedDate}
          onChange={handleDateChange}
          format="DD/MM/YYYY"
          disabledDate={(d) => d.isBefore(dayjs(), "day")}
          style={{ marginBottom: 20, width: 220 }}
          placeholder="Chọn ngày khám"
        />

        <div style={s.grid}>
          {SCHEDULES.map((time) => {
            const isBooked = bookedSlots.includes(time);
            const isSelected = selectedTime === time;
            return (
              <div
                key={time}
                onClick={() => !isBooked && onSelectTime(time)}
                style={{
                  ...s.slot,
                  ...(isSelected ? s.slotActive : {}),
                  ...(isBooked ? s.slotBooked : {}),
                }}
              >
                {time}
                {isBooked && <div style={s.bookedLabel}>Đã có lịch</div>}
              </div>
            );
          })}
        </div>

        <p style={s.hint}>Chọn giờ khám phù hợp với bạn</p>

        <button
          disabled={!selectedTime}
          onClick={() => setStep("confirm")}
          style={{ ...s.btn, ...(!selectedTime ? s.btnDisabled : {}) }}
        >
          Đặt lịch khám
        </button>
      </div>

      {/* ===== STEP 1 — Xác nhận thông tin ===== */}
      <Modal
        title="Xác nhận thông tin"
        open={step === "confirm"}
        onOk={handleCreateAppointment}
        onCancel={() => setStep(null)}
        okText="Tiếp tục thanh toán →"
        cancelText="Hủy"
        confirmLoading={loading}
        okButtonProps={{ style: { background: "#0a6abf" } }}
      >
        <Steps
          size="small"
          current={0}
          items={[{ title: "Xác nhận" }, { title: "Thanh toán QR" }, { title: "Hoàn tất" }]}
          style={{ marginBottom: 20 }}
        />

        <div style={s.confirmContent}>
          <div style={s.confirmRow}>
            <span style={s.confirmLabel}>Bác sĩ</span>
            <span style={s.confirmValue}>{doctor.degree} {doctor.user?.name}</span>
          </div>
          <div style={s.confirmRow}>
            <span style={s.confirmLabel}>Ngày khám</span>
            <span style={s.confirmValue}>{selectedDate?.format("DD/MM/YYYY")}</span>
          </div>
          <div style={s.confirmRow}>
            <span style={s.confirmLabel}>Giờ khám</span>
            <span style={{ ...s.confirmValue, color: "#0a6abf", fontWeight: 700 }}>
              {selectedTime}
            </span>
          </div>
          <div style={s.confirmRow}>
            <span style={s.confirmLabel}>Giá khám</span>
            <span style={{ ...s.confirmValue, color: "#e53e3e" }}>
              {doctor.price
                ? `${Number(doctor.price).toLocaleString("vi-VN")}đ`
                : "Liên hệ"}
            </span>
          </div>
          <div style={{ marginTop: 16 }}>
            <p style={s.confirmLabel}>Ghi chú (không bắt buộc)</p>
            <Input.TextArea
              rows={3}
              placeholder="Triệu chứng, yêu cầu đặc biệt..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={{ marginTop: 6 }}
            />
          </div>
        </div>
      </Modal>

      {/* ===== STEP 2 — Thanh toán QR ===== */}
      <Modal
        title="Quét mã QR để thanh toán"
        open={step === "qr"}
        onCancel={handleCancelModal}
        footer={null}
        closable={true}
        maskClosable={false}
      >
        <Steps
          size="small"
          current={1}
          items={[{ title: "Xác nhận" }, { title: "Thanh toán QR" }, { title: "Hoàn tất" }]}
          style={{ marginBottom: 20 }}
        />

        <div style={s.qrWrap}>
          <img
            src={qrUrl}
            alt="QR thanh toán"
            style={s.qrImg}
            onError={(e) => { e.target.style.display = "none"; }}
          />

          <div style={s.qrInfo}>
            <div style={s.qrInfoRow}>
              <span style={s.qrLabel}>Ngân hàng</span>
              <span style={s.qrValue}>{BANK_ID}</span>
            </div>
            <div style={s.qrInfoRow}>
              <span style={s.qrLabel}>Số tài khoản</span>
              <span style={s.qrValue}>{ACCOUNT_NO}</span>
            </div>
            <div style={s.qrInfoRow}>
              <span style={s.qrLabel}>Tên TK</span>
              <span style={s.qrValue}>{ACCOUNT_NAME}</span>
            </div>
            <div style={s.qrInfoRow}>
              <span style={s.qrLabel}>Số tiền</span>
              <span style={{ ...s.qrValue, color: "#e53e3e", fontWeight: 700 }}>
                {Number(qrAmount).toLocaleString("vi-VN")}đ
              </span>
            </div>
            <div style={s.qrInfoRow}>
              <span style={s.qrLabel}>Nội dung CK</span>
              <span style={{ ...s.qrValue, color: "#0a6abf", fontSize: 12 }}>
                {paymentContent}
              </span>
            </div>
          </div>

          {/* ✅ Trạng thái đang chờ thanh toán */}
          {waitingPayment && (
            <div style={s.waitingBox}>
              <Spin size="small" />
              <span style={{ marginLeft: 10, fontSize: 13, color: "#64748b" }}>
                Đang chờ xác nhận thanh toán...
              </span>
            </div>
          )}

          <div style={s.qrNote}>
            ⚠️ Vui lòng chuyển khoản <b>đúng số tiền</b> và <b>đúng nội dung</b>.
            Hệ thống sẽ tự động xác nhận sau khi nhận được thanh toán.
          </div>
        </div>
      </Modal>

      {/* ===== STEP 3 — Hoàn tất ===== */}
      <Modal
        open={step === "success"}
        footer={null}
        onCancel={() => setStep(null)}
        centered
        width={400}
      >
        <div style={s.successWrap}>
          <div style={s.successIcon}>✓</div>
          <h3 style={s.successTitle}>Đặt lịch thành công!</h3>
          <p style={s.successSub}>Email xác nhận đã được gửi về hộp thư của bạn</p>

          <div style={s.successInfo}>
            <div style={s.confirmRow}>
              <span style={s.confirmLabel}>Bác sĩ</span>
              <span style={s.confirmValue}>{doctor.degree} {doctor.user?.name}</span>
            </div>
            <div style={s.confirmRow}>
              <span style={s.confirmLabel}>Ngày khám</span>
              <span style={s.confirmValue}>{selectedDate?.format("DD/MM/YYYY")}</span>
            </div>
            <div style={s.confirmRow}>
              <span style={s.confirmLabel}>Giờ khám</span>
              <span style={{ ...s.confirmValue, color: "#0a6abf" }}>{selectedTime}</span>
            </div>
            <div style={{ ...s.confirmRow, border: "none" }}>
              <span style={s.confirmLabel}>Số tiền</span>
              <span style={{ ...s.confirmValue, color: "#e53e3e" }}>
                {Number(qrAmount).toLocaleString("vi-VN")}đ
              </span>
            </div>
          </div>

          <button onClick={() => setStep(null)} style={{ ...s.btn, marginTop: 8 }}>
            Hoàn tất
          </button>
        </div>
      </Modal>
    </>
  );
};

const s = {
  card: {
    background: "#fff", padding: 28, borderRadius: 20,
    boxShadow: "0 4px 24px rgba(0,0,0,0.07)", marginBottom: 20,
  },
  titleRow: { display: "flex", alignItems: "center", gap: 10, marginBottom: 20 },
  dot: { width: 4, height: 22, borderRadius: 4, background: "linear-gradient(#0a6abf, #1a9fe0)" },
  title: { fontSize: 17, fontWeight: 700, color: "#0f172a", margin: 0 },
  grid: { display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 8 },
  slot: {
    padding: "10px 18px", borderRadius: 10, cursor: "pointer",
    border: "1px solid #e2e8f0", background: "#f8fafc",
    fontSize: 13, fontWeight: 500, color: "#334155",
    transition: "all .15s", minWidth: 90, textAlign: "center",
  },
  slotActive: { background: "#0a6abf", color: "#fff", border: "1px solid #0a6abf" },
  slotBooked: { background: "#fef2f2", color: "#fca5a5", border: "1px solid #fecaca", cursor: "not-allowed" },
  bookedLabel: { fontSize: 9, color: "#ef4444", fontWeight: 600, marginTop: 2 },
  hint: { fontSize: 12, color: "#94a3b8", margin: "8px 0 16px" },
  btn: {
    width: "100%", padding: "12px 0", borderRadius: 12,
    background: "#0a6abf", color: "#fff", border: "none",
    fontSize: 15, fontWeight: 700, cursor: "pointer",
  },
  btnDisabled: { background: "#e2e8f0", color: "#94a3b8", cursor: "not-allowed" },
  confirmContent: { padding: "8px 0" },
  confirmRow: {
    display: "flex", justifyContent: "space-between",
    padding: "10px 0", borderBottom: "1px solid #f1f5f9",
  },
  confirmLabel: { fontSize: 13, color: "#94a3b8" },
  confirmValue: { fontSize: 14, color: "#0f172a", fontWeight: 600 },
  qrWrap: { display: "flex", flexDirection: "column", alignItems: "center", gap: 16 },
  qrImg: { width: 220, height: 220, borderRadius: 12, border: "1px solid #e2e8f0" },
  qrInfo: {
    width: "100%", background: "#f8fafc", borderRadius: 12,
    padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8,
  },
  qrInfoRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  qrLabel: { fontSize: 12, color: "#94a3b8" },
  qrValue: { fontSize: 13, fontWeight: 600, color: "#0f172a" },
  waitingBox: {
    display: "flex", alignItems: "center",
    background: "#f0f9ff", padding: "10px 16px",
    borderRadius: 10, width: "100%",
    border: "1px solid #bae6fd",
  },
  qrNote: {
    fontSize: 12, color: "#64748b", lineHeight: 1.6,
    background: "#fffbeb", padding: "10px 14px",
    borderRadius: 10, border: "1px solid #fef08a", width: "100%",
  },
  successWrap: {
    display: "flex", flexDirection: "column",
    alignItems: "center", padding: "24px 8px 8px", gap: 8,
  },
  successIcon: {
    width: 64, height: 64, borderRadius: "50%",
    background: "#dcfce7", color: "#16a34a",
    fontSize: 32, display: "flex", alignItems: "center",
    justifyContent: "center", fontWeight: 700, marginBottom: 8,
  },
  successTitle: { fontSize: 20, fontWeight: 700, color: "#0f172a", margin: 0 },
  successSub: { fontSize: 13, color: "#64748b", margin: "4px 0 16px", textAlign: "center" },
  successInfo: {
    width: "100%", background: "#f8fafc",
    borderRadius: 12, padding: "4px 16px", marginBottom: 8,
  },
};

export default DoctorBooking;