import {Row} from "antd";
import Filter from "../../components/patient/list.doctor/filter";
import ListDoctors from "../../components/patient/list.doctor/list.doctor";
import { useEffect, useState } from "react";
import { fetchAllDoctorAPI } from "../../services/api.service.doctor";

const DoctorList = () => {
    const [dataDoctor, setDataDoctor] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [filters, setFilters] = useState({});

    useEffect(() => {
        loadDoctor();
    }, [current, pageSize, filters]);


    const loadDoctor = async () => {
        const res = await fetchAllDoctorAPI(current, pageSize, filters);
        if (res.data) {
            setDataDoctor(res.data.result);
            setTotal(res.data.meta.totalElements);
        }
    };

    return (
        <div style={{ padding: "40px 80px" }}>
            <Row gutter={24}>
                <Filter setFilters={setFilters} />
                <ListDoctors
                    dataDoctor={dataDoctor}
                    current={current}
                    pageSize={pageSize}
                    total={total}
                    setCurrent={setCurrent}
                    setPageSize={setPageSize}
                />
            </Row>
        </div>
    );
};
export default DoctorList;