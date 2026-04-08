import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "antd";
import { fetchAllHospitalAPI } from "../../../services/api.service.hospital";

const HospitalCard = ({ hospital }) => {
  const navigate = useNavigate();

  return (
    <div
      style={styles.card}
      onClick={() => navigate(`/hospital/${hospital.id}`)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 10px 28px rgba(10,106,191,0.1)";
        e.currentTarget.style.borderColor = "#c2dcf5";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = "#e8edf3";
      }}
    >
      <div style={styles.imgBox}>
        {hospital.logo ? (
          <img
            src={`${import.meta.env.VITE_BACKEND_URL}/storage/logo_hospital/${hospital.logo}`}
            alt={hospital.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        {/* Fallback emoji — ẩn khi có ảnh */}
        <span style={{
          fontSize: 40,
          display: hospital.logo ? "none" : "flex",
          alignItems: "center", justifyContent: "center",
          width: "100%", height: "100%",
        }}>
          🏥
        </span>
      </div>

      <div style={styles.info}>
        <h3 style={styles.name}>{hospital.name}</h3>
        <p style={styles.location}>📍 {hospital.address}</p>
        {hospital.rating && (
          <p style={styles.rating}>★ {hospital.rating.toFixed(1)}</p>
        )}
      </div>
    </div>
  );
};

const HospitalCardSkeleton = () => (
  <div style={{ ...styles.card, overflow: "hidden" }}>
    <Skeleton.Image active style={{ width: "100%", height: 120 }} />
    <div style={{ padding: 14 }}>
      <Skeleton active paragraph={{ rows: 1 }} />
    </div>
  </div>
);

const ListHospital = () => {
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchAllHospitalAPI(1, 4);
        if (res?.data?.result) setHospitals(res.data.result);
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
            Cơ sở y tế <span style={styles.accent}>liên kết</span>
          </h2>
          <p style={styles.sub}>50+ bệnh viện và phòng khám uy tín toàn quốc</p>
        </div>
        <span style={styles.seeAll} onClick={() => navigate("/hospital")}>
          Xem tất cả →
        </span>
      </div>

      <div style={styles.grid}>
        {loading
          ? [1, 2, 3, 4].map((i) => <HospitalCardSkeleton key={i} />)
          : hospitals.map((h) => <HospitalCard key={h.id} hospital={h} />)
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
    background: "#fff", borderRadius: 14, overflow: "hidden",
    border: "1px solid #e8edf3", cursor: "pointer",
    transition: "transform .15s, box-shadow .15s, border-color .15s",
  },
  imgBox: {
    height: 120,
    background: "linear-gradient(135deg, #e8f4fd, #c9e4f7)",
    display: "flex", alignItems: "center", justifyContent: "center",
    overflow: "hidden",
  },
  info: { padding: 14 },
  name: { fontSize: 14, fontWeight: 600, color: "#1e2d3d", margin: "0 0 4px" },
  location: { fontSize: 12, color: "#8898aa", margin: "0 0 4px" },
  rating: { fontSize: 12, color: "#f5a623", fontWeight: 600, margin: 0 },
};

export default ListHospital;