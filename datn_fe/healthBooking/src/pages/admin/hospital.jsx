import { useEffect, useState } from "react";
import { fetchAllHospitalAPI } from "../../services/api.service.hospital";
import HospitalForm from "../../components/admin/hospital/hospital.form";
import TableHospital from "../../components/admin/hospital/table.hospital";

const ListHospitalAdmin = () => {
    const [dataHospitals , setDataHospitals] = useState([]) ;
    const [current , setCurrent] = useState(1) ;
    const [pageSize , setPageSize] = useState(10) ;
    const [total , setTotal] = useState(0) ;

    useEffect(() => {
        loadHospital();
    }, [current, pageSize]);

    const loadHospital = async() => {
        const res = await fetchAllHospitalAPI(current , pageSize) ;
        if ( res.data ) {
            setDataHospitals(res.data.result) ;
            setCurrent(res.data.meta.currentPage) ;
            setPageSize(res.data.meta.pageSize) ;
            setTotal(res.data.meta.totalElements) ;
        }
    }

    return (
        <>
            <HospitalForm loadHospital={loadHospital}/>
            <TableHospital
                loadHospital={loadHospital}
                dataHospitals={dataHospitals}
                current={current}
                pageSize={pageSize}
                total={total}
                setCurrent={setCurrent}
                setPageSize={setPageSize}

            />
        </>
    );
}
export default ListHospitalAdmin ;