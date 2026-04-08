import { useEffect, useState } from "react";
import Filter from "../../components/patient/list.doctor/filter";
import ListDoctors from "../../components/patient/list.doctor/list.doctor";
import { fetchAllDoctorAPI } from "../../services/api.service.doctor";

const DoctorList = () => {
  const [dataDoctor, setDataDoctor] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDoctor();
  }, [current, pageSize, filters]);

  const loadDoctor = async () => {
    setLoading(true);
    const res = await fetchAllDoctorAPI(current, pageSize, filters);
    if (res?.data) {
      setDataDoctor(res.data.result);
      setTotal(res.data.meta.totalElements);
    }
    setLoading(false);
  };

  return (
    <div style={s.page}>
      {/* Page header */}
      <div style={s.pageHeader}>
        <h1 style={s.pageTitle}>Tìm kiếm bác sĩ</h1>
        <p style={s.pageSub}>Kết nối với đội ngũ bác sĩ chuyên khoa hàng đầu toàn quốc</p>
      </div>

      {/* Main layout */}
      <div style={s.layout}>
        <Filter setFilters={(f) => { setCurrent(1); setFilters(f); }} />
        <div style={s.right}>
          {loading ? (
            <div style={s.skeletonWrap}>
              {[1, 2, 3].map((i) => <div key={i} style={s.skeleton} />)}
            </div>
          ) : (
            <ListDoctors
              dataDoctor={dataDoctor}
              current={current}
              pageSize={pageSize}
              total={total}
              setCurrent={setCurrent}
              setPageSize={setPageSize}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const s = {
  page: {
    background: "#f0f4f8",
    minHeight: "100vh",
    padding: "0 0 60px",
  },
  pageHeader: {
    background: "linear-gradient(135deg, #0a3d6b 0%, #0a6abf 60%, #1a9fe0 100%)",
    padding: "40px 80px 44px",
    marginBottom: -20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 700,
    color: "#fff",
    margin: "0 0 6px",
    letterSpacing: "-0.4px",
  },
  pageSub: {
    fontSize: 15,
    color: "#b8d9f2",
    margin: 0,
  },
  layout: {
    display: "flex",
    gap: 24,
    padding: "0 80px",
    alignItems: "flex-start",
  },
  right: { flex: 1, minWidth: 0 },
  skeletonWrap: { display: "flex", flexDirection: "column", gap: 14 },
  skeleton: {
    height: 140,
    background: "#e8edf3",
    borderRadius: 14,
    animation: "pulse 1.5s ease-in-out infinite",
  },
};

export default DoctorList;