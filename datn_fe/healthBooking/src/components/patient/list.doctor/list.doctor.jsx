import { Avatar, Pagination } from "antd";
import {
  CalendarOutlined,
  StarFilled,
  TrophyOutlined,
  BankOutlined,
} from "@ant-design/icons";
import { SPECIALIZATION_LABEL } from "../../../constant/doctor.constant";
import { useNavigate } from "react-router-dom";

const DoctorCard = ({ doc }) => {
  const navigate = useNavigate();

  const stars = Math.round(doc.rating || 0);
  const hasAvatar = !!doc.avatar;

  console.log("Doctors:" , doc) ;

  return (
    <div
      style={s.card}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 12px 36px rgba(10,106,191,0.11)";
        e.currentTarget.style.borderColor = "#c2dcf5";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)";
        e.currentTarget.style.borderColor = "#e8edf3";
      }}
    >
      {/* Left: avatar */}
      <div style={s.avatarWrap}>
        <Avatar
          size={82}
          src={
            hasAvatar
              ? `${import.meta.env.VITE_BACKEND_URL}/storage/avt_doctor/${doc.avatar}`
              : undefined
          }
          style={s.avatar}
        >
          {!hasAvatar && (doc.name?.[0] || "B")}
        </Avatar>
        {/* Available badge */}
        <div style={s.availBadge}>Còn lịch</div>
      </div>

      {/* Right: info */}
      <div style={s.info}>
        <div style={s.topRow}>
          <h3 style={s.name}>{doc.name}</h3>
          {/* Rating */}
          <div style={s.ratingBadge}>
            <StarFilled style={{ color: "#f5a623", fontSize: 11 }} />
            <span style={s.ratingNum}>{doc.rating?.toFixed(1) || "N/A"}</span>
          </div>
        </div>

        <div style={s.specBadge}>
          {SPECIALIZATION_LABEL[doc.specialization] || doc.specialization}
        </div>

        <div style={s.metaRow}>
          <div style={s.metaItem}>
            <TrophyOutlined style={{ color: "#0a6abf", fontSize: 12 }} />
            <span>{doc.experienceYears} năm kinh nghiệm</span>
          </div>
          {doc.hospital && (
            <div style={s.metaItem}>
              <BankOutlined style={{ color: "#0a6abf", fontSize: 12 }} />
              <span style={s.hospitalText}>
                {typeof doc.hospital === "object" ? doc.hospital.name : doc.hospital}
              </span>
            </div>
          )}
        </div>

        {/* Stars row */}
        <div style={s.starsRow}>
          {[1, 2, 3, 4, 5].map((i) => (
            <StarFilled
              key={i}
              style={{ fontSize: 13, color: i <= stars ? "#f5a623" : "#e2e8f0" }}
            />
          ))}
        </div>

        {/* Bottom row: price + button */}
        <div style={s.bottomRow}>
          <div>
            <div style={s.priceLabel}>Giá khám</div>
            <div style={s.price}>
              {doc.price?.toLocaleString("vi-VN")} đ
            </div>
          </div>
          <button
            style={s.bookBtn}
            onClick={() => navigate(`/doctors/${doc.id}`)}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#0858a0")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#0a6abf")}
          >
            <CalendarOutlined style={{ marginRight: 5 }} />
            Đặt lịch
          </button>
        </div>
      </div>
    </div>
  );
};

const ListDoctors = ({ dataDoctor, current, pageSize, total, setCurrent, setPageSize }) => {
  if (!dataDoctor?.length) {
    return (
      <div style={s.empty}>
        <div style={s.emptyIcon}>🔍</div>
        <p style={s.emptyText}>Không tìm thấy bác sĩ phù hợp</p>
        <p style={s.emptySubText}>Thử điều chỉnh bộ lọc để có kết quả khác</p>
      </div>
    );
  }

  return (
    <div style={s.wrapper}>
      {/* Result count */}
      <div style={s.resultBar}>
        <span style={s.resultCount}>
          Tìm thấy <strong>{total}</strong> bác sĩ
        </span>
      </div>

      {/* Grid */}
      <div style={s.grid}>
        {dataDoctor.map((doc) => (
          <DoctorCard key={doc.id} doc={doc} />
        ))}
      </div>

      {/* Pagination */}
      <div style={s.paginationWrap}>
        <Pagination
          current={current}
          pageSize={pageSize}
          total={total}
          showSizeChanger
          showTotal={(t) => `${t} bác sĩ`}
          onChange={(page, size) => {
            setCurrent(page);
            if (size !== pageSize) setPageSize(size);
          }}
        />
      </div>
    </div>
  );
};

const s = {
  wrapper: { flex: 1, minWidth: 0 },
  resultBar: {
    marginBottom: 16,
    padding: "10px 0 10px",
    borderBottom: "1px solid #f0f4f8",
  },
  resultCount: { fontSize: 14, color: "#64748b" },
  grid: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },

  /* Card */
  card: {
    background: "#fff",
    borderRadius: 14,
    border: "1px solid #e8edf3",
    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
    padding: "18px 20px",
    display: "flex",
    gap: 18,
    transition: "transform .15s, box-shadow .15s, border-color .15s",
    cursor: "default",
  },

  /* Avatar side */
  avatarWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    flexShrink: 0,
  },
  avatar: {
    background: "linear-gradient(135deg, #0a3d6b, #1890ff)",
    color: "#fff",
    fontSize: 28,
    fontWeight: 700,
    border: "3px solid #eef4ff",
  },
  availBadge: {
    background: "#edfaf3",
    color: "#0e9a57",
    fontSize: 11,
    fontWeight: 600,
    padding: "3px 10px",
    borderRadius: 6,
    whiteSpace: "nowrap",
  },

  /* Info side */
  info: { flex: 1, minWidth: 0 },
  topRow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: 700,
    color: "#1e2d3d",
    margin: 0,
    lineHeight: 1.3,
  },
  ratingBadge: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    background: "#fffbeb",
    border: "1px solid #fde68a",
    borderRadius: 6,
    padding: "3px 8px",
    flexShrink: 0,
  },
  ratingNum: { fontSize: 12, fontWeight: 700, color: "#92400e" },
  specBadge: {
    display: "inline-block",
    background: "#eef4ff",
    color: "#0a6abf",
    fontSize: 12,
    fontWeight: 600,
    padding: "3px 10px",
    borderRadius: 6,
    marginBottom: 10,
  },
  metaRow: { display: "flex", flexWrap: "wrap", gap: "4px 16px", marginBottom: 8 },
  metaItem: {
    display: "flex", alignItems: "center", gap: 5,
    fontSize: 13, color: "#64748b",
  },
  hospitalText: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: 220,
  },
  starsRow: { display: "flex", gap: 2, marginBottom: 12 },
  bottomRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderTop: "1px solid #f0f4f8",
    paddingTop: 12,
  },
  priceLabel: { fontSize: 11, color: "#94a3b8", fontWeight: 500, marginBottom: 2 },
  price: { fontSize: 16, fontWeight: 700, color: "#0a6abf" },
  bookBtn: {
    background: "#0a6abf",
    color: "#fff",
    border: "none",
    borderRadius: 9,
    padding: "9px 20px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    transition: "background .15s",
  },

  /* Empty state */
  empty: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "80px 0",
    background: "#fff",
    borderRadius: 14,
    border: "1px solid #e8edf3",
  },
  emptyIcon: { fontSize: 48, marginBottom: 14 },
  emptyText: { fontSize: 16, fontWeight: 600, color: "#1e2d3d", margin: "0 0 6px" },
  emptySubText: { fontSize: 13, color: "#94a3b8", margin: 0 },

  /* Pagination */
  paginationWrap: {
    display: "flex",
    justifyContent: "center",
    marginTop: 28,
    paddingTop: 20,
    borderTop: "1px solid #f0f4f8",
  },
};

export default ListDoctors;