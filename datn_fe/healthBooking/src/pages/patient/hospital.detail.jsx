import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import { fetchHospitalByIdAPI } from "../../services/api.service.hospital";
import { fetchAllDoctorByHospitalIdAPI } from "../../services/api.service.doctor";
import HospitalHeader from "../../components/patient/view.detail.hospital/header.view.detail.hospital";
import HospitalIntro from "../../components/patient/view.detail.hospital/hospital.intro";
import DoctorListByHospitalId from "../../components/patient/view.detail.hospital/doctor.card";


const HospitalDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [hospitalRes, doctorRes] = await Promise.all([
        fetchHospitalByIdAPI(id),
        fetchAllDoctorByHospitalIdAPI(id),
      ]);
      if (hospitalRes?.data) setData(hospitalRes.data);
      if (doctorRes?.data) setDoctors(doctorRes.data);
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) return <Spin fullscreen />;
  if (!data) return <p style={{ padding: 40 }}>Không tìm thấy bệnh viện</p>;

  return (
    <div style={{ background: "#f0f4f8", minHeight: "100vh", padding: "40px 80px" }}>
      <HospitalHeader data={data} />
      <HospitalIntro introduction={data.introduction} />
      <DoctorListByHospitalId doctors={doctors} />
    </div>
  );
};

export default HospitalDetail;