import { Baby, Bone, Brain, Eye, FlaskConical, Heart, Scissors, Smile, Sparkles, Stethoscope, UtensilsCrossed, Wind, Ear } from "lucide-react";
import { useNavigate } from "react-router-dom";

const specializations = [
  { name: "Tim mạch",      Icon: Heart          },
  { name: "Thần kinh",     Icon: Brain          },
  { name: "Cơ xương khớp", Icon: Bone           },
  { name: "Mắt",           Icon: Eye            },
  { name: "Nhi khoa",      Icon: Smile          },
  { name: "Sản phụ khoa",  Icon: Baby           },
  { name: "Tai mũi họng",  Icon: Ear            },
  { name: "Hô hấp",        Icon: Wind           },
  { name: "Nội tiết",      Icon: FlaskConical   },
  { name: "Nội tổng quát", Icon: Stethoscope    },
  { name: "Ngoại khoa",    Icon: Scissors       },
  { name: "Da liễu",       Icon: Sparkles       },
  { name: "Tâm lý",        Icon: Brain          },
  { name: "Tiêu hóa",      Icon: UtensilsCrossed},
];

const Specialization = () => {
  const navigate = useNavigate();

  return (
    <section style={styles.section}>
      <div style={styles.sectionHeader}>
        <div>
          <h2 style={styles.title}>
            Chuyên khoa <span style={styles.accent}>phổ biến</span>
          </h2>
          <p style={styles.sub}>Tìm bác sĩ theo chuyên khoa phù hợp với bạn</p>
        </div>
        <span style={styles.seeAll} onClick={() => navigate("/specialization")}>
          Xem tất cả →
        </span>
      </div>

      <div style={styles.scrollContainer}>
        {specializations.map((item, i) => (
          <div
            key={i}
            style={styles.card}
            onClick={() => navigate(`/specialization?name=${item.name}`)}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#0a6abf";
              e.currentTarget.style.background = "#eef4ff";
              e.currentTarget.querySelector(".card-icon")?.style && 
                (e.currentTarget.querySelector(".card-icon").style.background = "#0a6abf");
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e8edf3";
              e.currentTarget.style.background = "#fff";
              e.currentTarget.querySelector(".card-icon")?.style &&
                (e.currentTarget.querySelector(".card-icon").style.background = "#e8f0fb");
            }}
          >
            <div className="card-icon" style={styles.iconBox}>
              {item.Icon
                ? <item.Icon size={22} color="#0a6abf" strokeWidth={1.8} />
                : <span style={{ fontSize: 22, lineHeight: 1 }}>{item.emoji}</span>
              }
            </div>
            <p style={styles.name}>{item.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const styles = {
  section: {
    padding: "48px 0",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    color: "#1e2d3d",
    margin: 0,
    letterSpacing: "-0.3px",
  },
  accent: {
    color: "#0a6abf",
  },
  sub: {
    fontSize: 14,
    color: "#8898aa",
    margin: "4px 0 0",
  },
  seeAll: {
    fontSize: 13,
    color: "#0a6abf",
    fontWeight: 500,
    cursor: "pointer",
  },
  scrollContainer: {
    display: "flex",
    gap: 12,
    overflowX: "auto",
    paddingBottom: 8,
    scrollbarWidth: "thin",
    scrollbarColor: "#c8ddf0 transparent",
  },
  card: {
    minWidth: 118,
    background: "#fff",
    borderRadius: 14,
    padding: "18px 12px",
    textAlign: "center",
    border: "1.5px solid #e8edf3",
    cursor: "pointer",
    transition: "border-color .15s, background .15s",
    flexShrink: 0,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    background: "#e8f0fb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 10px",
    transition: "background .15s",
  },
  name: {
    fontSize: 12,
    fontWeight: 500,
    color: "#3d5166",
    lineHeight: 1.3,
    margin: 0,
  },
};

export default Specialization;