import { Button, Input, Select, Slider } from "antd";
import { useState } from "react";
import { SearchOutlined, ReloadOutlined, FilterOutlined } from "@ant-design/icons";
import { SPECIALIZATION_LABEL } from "../../../constant/doctor.constant";

const hospitalOptions = [
  { label: 'Bệnh viện Bạch Mai', value: 'Bệnh viện Bạch Mai' },
  { label: 'Bệnh viện Hữu Nghị Việt Đức', value: 'Bệnh viện Hữu Nghị Việt Đức' },
  { label: 'Bệnh viện Phụ Sản Hà Nội', value: 'Bệnh viện Phụ Sản Hà Nội' },
  { label: 'Bệnh viện Đa khoa Đà Nẵng', value: 'Bệnh viện Đa khoa Đà Nẵng' },
  { label: 'Bệnh viện C Đà Nẵng', value: 'Bệnh viện C Đà Nẵng' },
  { label: 'Bệnh viện Hoàn Mỹ Đà Nẵng', value: 'Bệnh viện Hoàn Mỹ Đà Nẵng' },
  { label: 'Bệnh viện Chợ Rẫy', value: 'Bệnh viện Chợ Rẫy' },
  { label: 'Bệnh viện Đại học Y Dược TP.HCM', value: 'Bệnh viện Đại học Y Dược TP.HCM' },
  { label: 'Bệnh viện Nhân dân 115', value: 'Bệnh viện Nhân dân 115' },
  { label: 'Bệnh viện FV', value: 'Bệnh viện FV' },
];

const Filter = ({ setFilters }) => {
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [hospital, setHospital] = useState("");
  const [priceRange, setPriceRange] = useState([100000, 1000000]);

  const handleSearch = () => {
    setFilters({ name, specialization, hospital, minPrice: priceRange[0], maxPrice: priceRange[1] });
  };

  const handleReset = () => {
    setName("");
    setSpecialization("");
    setHospital("");
    setPriceRange([100000, 1000000]);
    setFilters({});
  };

  return (
    <div style={s.card}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.headerIcon}><FilterOutlined /></div>
        <span style={s.headerTitle}>Bộ lọc tìm kiếm</span>
      </div>

      <div style={s.body}>
        {/* Tên bác sĩ */}
        <div style={s.field}>
          <label style={s.label}>Tên bác sĩ</label>
          <Input
            prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
            placeholder="Nhập tên bác sĩ..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onPressEnter={handleSearch}
            style={s.input}
          />
        </div>

        {/* Chuyên khoa */}
        <div style={s.field}>
          <label style={s.label}>Chuyên khoa</label>
          <Select
            style={{ width: "100%" }}
            placeholder="Chọn chuyên khoa"
            allowClear
            value={specialization || undefined}
            onChange={(val) => setSpecialization(val || "")}
            styles={{ popup: { root: { borderRadius: 10 } } }}
          >
            {Object.entries(SPECIALIZATION_LABEL).map(([key, label]) => (
              <Select.Option key={key} value={key}>{label}</Select.Option>
            ))}
          </Select>
        </div>

        {/* Bệnh viện */}
        <div style={s.field}>
          <label style={s.label}>Bệnh viện</label>
          <Select
            style={{ width: "100%" }}
            placeholder="Chọn bệnh viện"
            allowClear
            value={hospital || undefined}
            onChange={(val) => setHospital(val || "")}
            options={hospitalOptions}
          />
        </div>

        {/* Giá khám */}
        <div style={s.field}>
          <div style={s.priceRow}>
            <label style={s.label}>Giá khám</label>
            <span style={s.priceVal}>
              {priceRange[0].toLocaleString()} – {priceRange[1].toLocaleString()}đ
            </span>
          </div>
          <Slider
            range
            min={100000}
            max={1000000}
            step={50000}
            value={priceRange}
            onChange={setPriceRange}
            styles={{
              track: { background: "#0a6abf" },
              handle: { borderColor: "#0a6abf" },
            }}
          />
          <div style={s.priceHint}>
            <span>100K</span><span>1,000K</span>
          </div>
        </div>

        {/* Divider */}
        <div style={s.divider} />

        {/* Buttons */}
        <button style={s.searchBtn} onClick={handleSearch}>
          <SearchOutlined style={{ marginRight: 6 }} />
          Tìm kiếm
        </button>
        <button style={s.resetBtn} onClick={handleReset}>
          <ReloadOutlined style={{ marginRight: 6 }} />
          Xóa bộ lọc
        </button>
      </div>
    </div>
  );
};

const s = {
  card: {
    width: 260,
    flexShrink: 0,
    background: "#fff",
    borderRadius: 16,
    border: "1px solid #e8edf3",
    overflow: "hidden",
    alignSelf: "flex-start",
    position: "sticky",
    top: 88,
  },
  header: {
    background: "linear-gradient(135deg, #0a3d6b, #0a6abf)",
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  headerIcon: {
    width: 30, height: 30,
    background: "rgba(255,255,255,0.15)",
    borderRadius: 8,
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff", fontSize: 14,
  },
  headerTitle: {
    fontSize: 15, fontWeight: 700, color: "#fff",
  },
  body: {
    padding: "20px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  field: { marginBottom: 14 },
  label: {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: 7,
  },
  input: { borderRadius: 9, height: 38 },
  priceRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4,
  },
  priceVal: { fontSize: 12, color: "#0a6abf", fontWeight: 600 },
  priceHint: {
    display: "flex", justifyContent: "space-between",
    fontSize: 11, color: "#94a3b8", marginTop: -6,
  },
  divider: { height: 1, background: "#f0f4f8", margin: "6px 0 14px" },
  searchBtn: {
    width: "100%", background: "#0a6abf", color: "#fff",
    border: "none", borderRadius: 10, padding: "10px 0",
    fontSize: 14, fontWeight: 600, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    marginBottom: 8,
  },
  resetBtn: {
    width: "100%", background: "#f8fafc", color: "#64748b",
    border: "1px solid #e8edf3", borderRadius: 10, padding: "9px 0",
    fontSize: 14, fontWeight: 500, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
};

export default Filter;