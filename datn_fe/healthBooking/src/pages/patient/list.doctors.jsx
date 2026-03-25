import {
  Card,
  Row,
  Col,
  Select,
  Slider,
  Rate,
  Button,
  Avatar,
} from "antd";
import Filter from "../../components/patient/list.doctor/filter";
import ListDoctors from "../../components/patient/list.doctor/list.doctor";

const DoctorList = () => {
  const doctors = [
    {
      name: "BS. Nguyễn Văn A",
      specialty: "Tim mạch",
      exp: "10 năm",
      price: 300000,
      rating: 4.5,
    },
    {
      name: "BS. Trần Thị B",
      specialty: "Da liễu",
      exp: "7 năm",
      price: 200000,
      rating: 4,
    },
    {
      name: "BS. Nguyễn Văn A",
      specialty: "Tim mạch",
      exp: "10 năm",
      price: 300000,
      rating: 4.5,
    },
    {
      name: "BS. Trần Thị B",
      specialty: "Da liễu",
      exp: "7 năm",
      price: 200000,
      rating: 4,
    },
    {
      name: "BS. Nguyễn Văn A",
      specialty: "Tim mạch",
      exp: "10 năm",
      price: 300000,
      rating: 4.5,
    },
    {
      name: "BS. Trần Thị B",
      specialty: "Da liễu",
      exp: "7 năm",
      price: 200000,
      rating: 4,
    },
  ];

  return (
    <div style={{ padding: "40px 80px" }}>
      <Row gutter={24}>

        <Filter/>

        <ListDoctors/>

      </Row>
    </div>
  );
};

export default DoctorList;