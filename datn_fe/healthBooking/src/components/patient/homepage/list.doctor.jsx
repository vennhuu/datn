import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { fetchAllDoctorAPI } from "../../../services/api.service.doctor";

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();
  const isFemale = doctor.user?.name?.includes("Thị") || doctor.user?.name?.includes("Thu");

  return (
    <div
      style={styles.card}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 36px rgba(10,106,191,0.12)";
        e.currentTarget.style.borderColor = "#c2dcf5";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = "#e8edf3";
      }}
    >
      {/* Image */}
      <div style={styles.imgWrapper}>
        {doctor.avatar ? (
          <img
            src={`${import.meta.env.VITE_BACKEND_URL}/storage/avt_doctor/${doctor.avatar}`}
            alt={doctor.user?.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => { e.target.style.display = "none"; }}
          />
        ) : (
          <span style={{ fontSize: 56 }}>{isFemale ? "👩‍⚕️" : "👨‍⚕️"}</span>
        )}
        <div style={styles.availableBadge}>Còn lịch</div>
      </div>

      {/* Info */}
      <div style={styles.info}>
        <h3 style={styles.name}>
          {doctor.degree ? `${doctor.degree} ` : ""}{doctor.user?.name}
        </h3>
        <p style={styles.spec}>{doctor.specialization || "Đa khoa"}</p>
        <p style={styles.hospital}>🏥 {doctor.hospital?.name || "—"}</p>

        <div style={styles.meta}>
          <span style={styles.rating}>★ {doctor.rating?.toFixed(1) ?? "5.0"}</span>
          {doctor.experienceYears && (
            <span style={styles.exp}>{doctor.experienceYears} năm KN</span>
          )}
        </div>

        <button
          style={styles.bookBtn}
          onClick={() => navigate(`/doctors/${doctor.id}`)}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#0858a0")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#0a6abf")}
        >
          <CalendarOutlined style={{ marginRight: 6 }} />
          Đặt lịch khám
        </button>
      </div>
    </div>
  );
};

const DoctorCardSkeleton = () => (
  <div style={{ ...styles.card, padding: 16 }}>
    <Skeleton.Image active style={{ width: "100%", height: 180, borderRadius: 0 }} />
    <Skeleton active paragraph={{ rows: 3 }} style={{ marginTop: 12 }} />
  </div>
);

const ListDoctor = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchAllDoctorAPI(1, 4);
        if (res?.data?.result) setDoctors(res.data.result);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <section style={styles.section}>
      <div style={styles.sectionHeader}>
        <div>
          <h2 style={styles.title}>
            Bác sĩ <span style={styles.accent}>nổi bật</span>
          </h2>
          <p style={styles.sub}>Đội ngũ bác sĩ uy tín, nhiều năm kinh nghiệm</p>
        </div>
        <span style={styles.seeAll} onClick={() => navigate("/doctors")}>
          Xem tất cả →
        </span>
      </div>

      <div style={styles.grid}>
        {loading
          ? [1, 2, 3, 4].map((i) => <DoctorCardSkeleton key={i} />)
          : doctors.map((doc) => <DoctorCard key={doc.id} doctor={doc} />)
        }
      </div>
    </section>
  );
};

const styles = {
  section: { paddingBottom: 48 },
  sectionHeader: {
    display: "flex", justifyContent: "space-between",
    alignItems: "flex-end", marginBottom: 24,
  },
  title: { fontSize: 22, fontWeight: 700, color: "#1e2d3d", margin: 0, letterSpacing: "-0.3px" },
  accent: { color: "#0a6abf" },
  sub: { fontSize: 14, color: "#8898aa", margin: "4px 0 0" },
  seeAll: { fontSize: 13, color: "#0a6abf", fontWeight: 500, cursor: "pointer" },
  grid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 },
  card: {
    background: "#fff", borderRadius: 16, overflow: "hidden",
    border: "1px solid #e8edf3",
    transition: "transform .15s, box-shadow .15s, border-color .15s",
    cursor: "pointer",
  },
  imgWrapper: {
    height: 180,
    background: "linear-gradient(135deg, #d4eaf8, #b8d4f0)",
    display: "flex", alignItems: "center", justifyContent: "center",
    position: "relative", overflow: "hidden",
  },
  availableBadge: {
    position: "absolute", top: 12, right: 12,
    background: "#edfaf3", color: "#0e9a57",
    fontSize: 11, fontWeight: 600,
    padding: "3px 8px", borderRadius: 6,
  },
  info: { padding: 16 },
  name: { fontSize: 15, fontWeight: 700, color: "#1e2d3d", margin: "0 0 4px" },
  spec: { fontSize: 12, color: "#0a6abf", fontWeight: 500, margin: "0 0 4px" },
  hospital: { fontSize: 12, color: "#8898aa", margin: "0 0 10px" },
  meta: { display: "flex", alignItems: "center", gap: 12, marginBottom: 12 },
  rating: { fontSize: 12, color: "#f5a623", fontWeight: 600 },
  exp: { fontSize: 12, color: "#8898aa" },
  bookBtn: {
    width: "100%", background: "#0a6abf", color: "white",
    border: "none", padding: "9px 0", borderRadius: 9,
    fontSize: 13, fontWeight: 600, cursor: "pointer",
    transition: "background .15s",
  },
};

export default ListDoctor;