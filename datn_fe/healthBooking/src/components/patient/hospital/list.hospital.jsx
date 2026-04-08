import { FilterOutlined } from "@ant-design/icons";
import { s } from "./hospital.style";
import HospitalCard from "./hospital.card";

const CITIES = [
  { label: "Tất cả", value: "" },
  { label: "Hà Nội", value: "HA_NOI" },
  { label: "TP.HCM", value: "HO_CHI_MINH" },
  { label: "Đà Nẵng", value: "DA_NANG" },
];

const HospitalList = ({ data, total, city, loading }) => {
  return (
    <div style={s.content}>
      <div style={s.resultBar}>
        <span style={s.resultText}>
          Tìm thấy <strong>{total}</strong> cơ sở y tế
          {city ? ` tại ${CITIES.find((c) => c.value === city)?.label}` : ""}
        </span>
        <FilterOutlined style={{ color: "#94a3b8" }} />
      </div>

      {loading ? (
        <div style={s.skeletonGrid}>
          {[1, 2, 3, 4].map((i) => <div key={i} style={s.skeleton} />)}
        </div>
      ) : data.length === 0 ? (
        <div style={s.empty}>
          <div style={s.emptyIcon}>🏥</div>
          <p style={s.emptyText}>Không tìm thấy cơ sở y tế phù hợp</p>
          <p style={s.emptySub}>Thử thay đổi từ khóa hoặc địa điểm</p>
        </div>
      ) : (
        <div style={s.grid}>
          {data.map((item) => (
            <HospitalCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HospitalList;