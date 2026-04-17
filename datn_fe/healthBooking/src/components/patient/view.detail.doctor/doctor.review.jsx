import { useEffect, useState } from "react";
import { Rate, Avatar, message, Popconfirm } from "antd";
import { UserOutlined, SendOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  createReviewAPI,
  getReviewsByDoctorAPI,
  deleteReviewAPI,
} from "../../../services/api.service.review";

const DoctorReview = ({ doctorId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  // Lấy userId của người dùng đang đăng nhập
  // Tuỳ dự án bạn lưu ở localStorage, context, redux...
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = currentUser?.id;

  console.log("currentUser:", currentUser);
  console.log("currentUserId:", currentUserId);
  console.log("reviews[0].userId:", reviews[0]?.userId);

  useEffect(() => { 
    loadReviews(); 
  }, [doctorId]);

  const loadReviews = async () => {
    setLoading(true);
    const res = await getReviewsByDoctorAPI(doctorId);
    if (res?.data) setReviews(res.data);
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!comment.trim()) { message.warning("Vui lòng nhập nhận xét"); return; }
    setSubmitting(true);
    const res = await createReviewAPI({ doctorId, rating, comment });
    if (res?.data) {
      message.success("Cảm ơn bạn đã đánh giá!");
      setComment(""); setRating(5); loadReviews();
    } else {
      message.error(res?.message || "Bạn đã đánh giá bác sĩ này rồi");
    }
    setSubmitting(false);
  };

  // ✅ Hàm xóa
  const handleDelete = async (reviewId) => {
    const res = await deleteReviewAPI(reviewId);
    if (res?.status === 200) {
      message.success("Đã xóa đánh giá");
      loadReviews();
    } else {
      message.error("Xóa thất bại");
    }
  };

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const ratingCount = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    percent: reviews.length
      ? Math.round((reviews.filter((r) => r.rating === star).length / reviews.length) * 100)
      : 0,
  }));

  return (
    <div style={s.wrap}>
      <div style={s.titleRow}>
        <span style={s.dot} />
        <h3 style={s.title}>Đánh giá & Nhận xét</h3>
        <span style={s.count}>{reviews.length} đánh giá</span>
      </div>

      {reviews.length > 0 && (
        <div style={s.summary}>
          <div style={s.avgBlock}>
            <div style={s.avgNum}>{avgRating}</div>
            <Rate disabled allowHalf value={parseFloat(avgRating)} style={{ fontSize: 18 }} />
            <div style={s.avgLabel}>Trung bình</div>
          </div>
          <div style={s.barBlock}>
            {ratingCount.map(({ star, count, percent }) => (
              <div key={star} style={s.barRow}>
                <span style={s.barLabel}>{star} ★</span>
                <div style={s.barBg}>
                  <div style={{ ...s.barFill, width: `${percent}%` }} />
                </div>
                <span style={s.barCount}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={s.writeBox}>
        <div style={s.writeTitle}>Viết đánh giá của bạn</div>
        <Rate value={rating} onChange={setRating} style={{ marginBottom: 12 }} />
        <div style={s.inputRow}>
          <textarea
            style={s.textarea}
            placeholder="Chia sẻ trải nghiệm của bạn với bác sĩ..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
          />
          <button
            style={{ ...s.submitBtn, ...(submitting ? s.submitBtnDisabled : {}) }}
            onClick={handleSubmit}
            disabled={submitting}
          >
            <SendOutlined style={{ marginRight: 6 }} />
            {submitting ? "Đang gửi..." : "Gửi"}
          </button>
        </div>
      </div>

      <div style={s.list}>
        {loading ? (
          [1, 2].map((i) => <div key={i} style={s.skeleton} />)
        ) : reviews.length === 0 ? (
          <div style={s.empty}>Chưa có đánh giá nào. Hãy là người đầu tiên!</div>
        ) : (
          reviews.map((r) => (
            <div key={r.id} style={s.reviewCard}>
              <Avatar
                size={40}
                src={r.userAvatar
                  ? `${import.meta.env.VITE_BACKEND_URL}/storage/avt_patient/${r.userAvatar}`
                  : null}
                icon={!r.userAvatar && <UserOutlined />}
                style={{ background: "#0a6abf", flexShrink: 0 }}
              />
              <div style={s.reviewBody}>
                <div style={s.reviewTop}>
                  <span style={s.reviewName}>{r.userName}</span>
                  <Rate disabled value={r.rating} style={{ fontSize: 12 }} />

                  {currentUserId && String(r.userId) === String(currentUserId) && (
                    <Popconfirm
                      title="Xóa đánh giá này?"
                      onConfirm={() => handleDelete(r.id)}
                      okText="Xóa"
                      cancelText="Hủy"
                    >
                      <button style={s.deleteBtn}>
                        <DeleteOutlined />
                      </button>
                    </Popconfirm>
                  )}
                </div>
                <p style={s.reviewComment}>{r.comment}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const s = {
  wrap: {
    background: "#fff", borderRadius: 20,
    boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
    padding: 28, marginTop: 20,
  },
  titleRow: { display: "flex", alignItems: "center", gap: 10, marginBottom: 20 },
  dot: { width: 4, height: 22, borderRadius: 4, background: "linear-gradient(#0a6abf, #1a9fe0)", flexShrink: 0 },
  title: { fontSize: 17, fontWeight: 700, color: "#0f172a", margin: 0, flex: 1 },
  count: { background: "#eef4ff", color: "#0a6abf", fontSize: 12, fontWeight: 600, padding: "3px 12px", borderRadius: 20 },

  summary: {
    display: "flex", gap: 32, padding: "20px 24px",
    background: "#f8fafc", borderRadius: 16, marginBottom: 24,
  },
  avgBlock: { display: "flex", flexDirection: "column", alignItems: "center", gap: 6, minWidth: 80 },
  avgNum: { fontSize: 42, fontWeight: 700, color: "#0f172a", lineHeight: 1 },
  avgLabel: { fontSize: 12, color: "#94a3b8" },
  barBlock: { flex: 1, display: "flex", flexDirection: "column", gap: 6, justifyContent: "center" },
  barRow: { display: "flex", alignItems: "center", gap: 10 },
  barLabel: { fontSize: 12, color: "#64748b", width: 28, flexShrink: 0 },
  barBg: { flex: 1, height: 8, background: "#e2e8f0", borderRadius: 4, overflow: "hidden" },
  barFill: { height: "100%", background: "#f5a623", borderRadius: 4, transition: "width .3s" },
  barCount: { fontSize: 12, color: "#94a3b8", width: 20, textAlign: "right" },

  writeBox: {
    background: "#f8fafc", borderRadius: 16,
    padding: 20, marginBottom: 24,
  },
  writeTitle: { fontSize: 14, fontWeight: 600, color: "#0f172a", marginBottom: 10 },
  inputRow: { display: "flex", gap: 12, alignItems: "flex-end" },
  textarea: {
    flex: 1, padding: "12px 14px", borderRadius: 12,
    border: "1px solid #e2e8f0", fontSize: 14, color: "#334155",
    resize: "none", outline: "none", fontFamily: "inherit",
    lineHeight: 1.6,
  },
  submitBtn: {
    padding: "10px 20px", borderRadius: 12, border: "none",
    background: "#0a6abf", color: "#fff", fontSize: 14,
    fontWeight: 600, cursor: "pointer", flexShrink: 0,
    display: "flex", alignItems: "center",
  },
  submitBtnDisabled: { background: "#e2e8f0", color: "#94a3b8", cursor: "not-allowed" },

  list: { display: "flex", flexDirection: "column", gap: 16 },
  skeleton: { height: 80, background: "#f1f5f9", borderRadius: 12 },
  empty: { textAlign: "center", padding: "32px 0", color: "#94a3b8", fontSize: 14 },

  reviewCard: {
    display: "flex", gap: 14, padding: "16px 0",
    borderBottom: "1px solid #f8fafc",
  },
  reviewBody: { flex: 1 },
  reviewTop: { display: "flex", alignItems: "center", gap: 12, marginBottom: 6 },
  reviewName: { fontSize: 14, fontWeight: 600, color: "#0f172a" },
  reviewComment: { fontSize: 14, color: "#475569", lineHeight: 1.7, margin: 0 },
  deleteBtn: {
    marginLeft: "auto",
    background: "none",
    border: "none",
    color: "#ef4444",
    cursor: "pointer",
    fontSize: 14,
    padding: "2px 6px",
    borderRadius: 6,
    transition: "background .2s",
  },
};

export default DoctorReview;