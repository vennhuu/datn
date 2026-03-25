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