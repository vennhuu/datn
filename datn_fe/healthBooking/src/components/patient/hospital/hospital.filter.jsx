import { SearchOutlined } from "@ant-design/icons";
import { s } from "./hospital.style";

const CITIES = [
  { label: "Tất cả", value: "" },
  { label: "Hà Nội", value: "HA_NOI" },
  { label: "TP.HCM", value: "HO_CHI_MINH" },
  { label: "Đà Nẵng", value: "DA_NANG" },
];

const HospitalFilter = ({ name, setName, city, setCity, total, onSearch }) => {
  return (
    <div style={s.pageHeader}>
      <div style={s.headerContent}>
        <div>
          <h1 style={s.pageTitle}>Cơ sở y tế liên kết</h1>
          <p style={s.pageSub}>Hệ thống bệnh viện và phòng khám uy tín toàn quốc</p>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={s.statNum}>{total}+</div>
          <div style={s.statLabel}>Cơ sở y tế</div>
        </div>
      </div>

      <div style={s.searchWrap}>
        <div style={s.searchBar}>
          <SearchOutlined style={{ color: "#94a3b8", fontSize: 16, marginLeft: 14 }} />
          <input
            style={s.searchInput}
            placeholder="Tìm kiếm bệnh viện, phòng khám..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
          />
          <button style={s.searchBtn} onClick={onSearch}>Tìm kiếm</button>
        </div>

        <div style={s.cityTabs}>
          {CITIES.map((c) => (
            <button
              key={c.value}
              style={{ ...s.cityTab, ...(city === c.value ? s.cityTabActive : {}) }}
              onClick={() => setCity(c.value)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HospitalFilter;