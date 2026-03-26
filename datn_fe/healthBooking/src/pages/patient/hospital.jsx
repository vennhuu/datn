import { useEffect, useState } from "react";
import HospitalFilter from "../../components/patient/hospital/hospital.filter";
import ListHospital from "../../components/patient/hospital/list.hospital";
import { fetchAllHospitalAPI } from "../../services/api.service.hospital";

const Hospital = () => {

  const [dataHospital , setDataHospital] = useState([]) ;
  const [current , setCurrent] = useState(1) ;
  const [pageSize , setPageSize] = useState(10) ;
  const [total , setTotal] = useState(0) ;

  useEffect(() => {
    loadHospital();
  }, [current, pageSize]);

  const loadHospital = async() => {
    const res = await fetchAllHospitalAPI(current , pageSize) ;
    if ( res.data ) {
      setDataHospital(res.data.result) ;
      setCurrent(res.data.meta.currentPage) ;
      setPageSize(res.data.meta.pageSize) ;
      setTotal(res.data.meta.totalElements) ;
    }
  }

  return (
    <div style={{ padding: "40px 80px" }}>
      <HospitalFilter/>

      {/* LIST */}
      <ListHospital dataHospital={dataHospital}/>
    </div>
  );
};

export default Hospital;