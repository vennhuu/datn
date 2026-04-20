import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spin, Row, Col } from "antd";
import { fetchDoctorByIdAPI } from "../../services/api.service.doctor";
import DoctorHeader from "../../components/patient/view.detail.doctor/doctor.header";
import DoctorBooking from "../../components/patient/view.detail.doctor/doctor.booking";
import DoctorInfo from "../../components/patient/view.detail.doctor/doctor.infor";
import DoctorSidebar from "../../components/patient/view.detail.doctor/doctor.sidebar";
import DoctorReview from "../../components/patient/view.detail.doctor/doctor.review";
import { useThemeTokens } from "../../context/themeTokens";

const DoctorDetail = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTime, setSelectedTime] = useState(null);
  const t = useThemeTokens();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await fetchDoctorByIdAPI(id);
        setDoctor(res.data);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return <Spin fullscreen />;
  if (!doctor) return <p style={{ padding: 40 }}>Không tìm thấy bác sĩ</p>;

  return (
    <div style={{ background: t.pageBg, minHeight: "100vh", padding: "40px 80px" }}>
      <DoctorHeader doctor={doctor} />

      <Row gutter={24} style={{ marginTop: 20 }}>
        <Col span={16}>
          <DoctorBooking
            doctor={doctor}
            selectedTime={selectedTime}
            onSelectTime={setSelectedTime}
          />
          <DoctorInfo doctor={doctor} />
          <DoctorReview doctorId={doctor.id} />
        </Col>

        <Col span={8}>
          <DoctorSidebar
            doctor={doctor}
            selectedTime={selectedTime}
            onBook={() => console.log("Đặt lịch:", selectedTime)}
          />
        </Col>
      </Row>
    </div>
  );
};

export default DoctorDetail;