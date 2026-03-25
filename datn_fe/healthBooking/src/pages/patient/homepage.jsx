import { Content } from "antd/es/layout/layout";
import Banner from "../../components/patient/homepage/banner";
import Specialization from "../../components/patient/homepage/specialization";
import ListDoctor from "../../components/patient/homepage/list.doctor";
import ScheduleProcess from "../../components/patient/homepage/schedule.process";
import ListHospital from "../../components/patient/homepage/list.hospital";

const Homepage = () => {
    return  (
        <>
            {/* HERO */}
            <Banner/>

            {/* CONTENT */}
            <Content style={{ padding: "40px 80px" }}>
                {/* CHUYÊN KHOA */}
                <Specialization/>

                {/* BÁC SĨ */}
                <ListDoctor/>

                <ListHospital/>

                {/* QUY TRÌNH */}
                <ScheduleProcess/>

            </Content>
        </>
    )
}

export default Homepage ;