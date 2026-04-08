import { useEffect, useState } from "react";
import { Pagination } from "antd";
import { fetchAllHospitalAPI } from "../../services/api.service.hospital";
import HospitalFilter from "../../components/patient/hospital/hospital.filter";
import HospitalList from "../../components/patient/hospital/list.hospital";
import { s } from "../../components/patient/hospital/hospital.style";


const Hospital = () => {
  const [dataHospital, setDataHospital] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    loadHospital();
  }, [current, pageSize, city]);

  const loadHospital = async () => {
    setLoading(true);
    const res = await fetchAllHospitalAPI(current, pageSize, { name, city });
    if (res?.data) {
      setDataHospital(res.data.result);
      setCurrent(res.data.meta.currentPage);
      setPageSize(res.data.meta.pageSize);
      setTotal(res.data.meta.totalElements);
    }
    setLoading(false);
  };

  const handleSearch = () => {
    setCurrent(1);
    loadHospital();
  };

  return (
    <div style={s.page}>
      <HospitalFilter
        name={name}
        setName={setName}
        city={city}
        setCity={(val) => { setCity(val); setCurrent(1); }}
        total={total}
        onSearch={handleSearch}
      />

      <HospitalList
        data={dataHospital}
        total={total}
        city={city}
        loading={loading}
      />

      {total > pageSize && (
        <div style={s.paginationWrap}>
          <Pagination
            current={current}
            pageSize={pageSize}
            total={total}
            showSizeChanger
            showTotal={(t) => `${t} cơ sở y tế`}
            onChange={(page, size) => {
              setCurrent(page);
              if (size !== pageSize) setPageSize(size);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Hospital;