import { useEffect, useState } from "react";
import DoctorForm from "../../components/admin/doctor/doctor.form";
import TableDoctor from "../../components/admin/doctor/table.doctor";
import { fetchAllDoctorAPI } from "../../services/api.service.doctor";


const Doctor = () => {

    const [dataDoctors , setDataDoctors] = useState([]) ;
    const [current , setCurrent] = useState(1) ;
    const [pageSize , setPageSize] = useState(10) ;
    const [total , setTotal] = useState(0) ;

    useEffect(() => {
        loadDoctor();
    }, [current, pageSize]);

    const loadDoctor = async() => {
        const res = await fetchAllDoctorAPI(current , pageSize) ;
        if ( res.data ) {
            setDataDoctors(res.data.result);
            setTotal(res.data.meta.totalElements);
        }
    }
    return (
        <>
            <DoctorForm loadDoctor={loadDoctor}/>
            <TableDoctor
                loadDoctor={loadDoctor}
                dataDoctors={dataDoctors}
                current={current}
                pageSize={pageSize}
                total={total}
                setCurrent={setCurrent}
                setPageSize={setPageSize}

            />
        </>
    );
}

export default Doctor ;