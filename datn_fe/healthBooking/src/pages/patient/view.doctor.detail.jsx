import {
  Card,
  Row,
  Col,
  Avatar,
  Button,
  Rate,
  Tag,
  Select,
  Divider,
  List,
} from "antd";
import { useState } from "react";

const DoctorDetail = () => {
  const [selectedTime, setSelectedTime] = useState(null);

  // 🔥 DATA
  const doctor = {
    name: "BS CKII Lê Hồng Anh",
    specialization: "Hô hấp",
    hospital: "Bệnh viện Bạch Mai",
    experience: 20,
    degree: "Bác sĩ CKII",
    bio: "Chuyên gia đầu ngành về bệnh phổi, COPD, hen suyễn...",
    rating: 4.7,
    reviews: 150,
    price: "300.000đ",
    address: "Hà Nội",
    avatar: "https://i.pravatar.cc/150?img=15",
  };

  const schedules = ["08:00", "09:00", "10:00", "13:30", "14:30"];

  const reviews = [
    {
      name: "Nguyễn Văn A",
      rating: 5,
      comment: "Bác sĩ rất tận tình, khám kỹ.",
    },
    {
      name: "Trần Thị B",
      rating: 4,
      comment: "Tư vấn dễ hiểu, nhiệt tình.",
    },
  ];

  return (
    <div style={{ background: "#f5f7fa", padding: "20px 80px" }}>
      {/* HEADER */}
      <Card style={{ borderRadius: 12 }}>
        <Row gutter={16}>
          <Col>
            <Avatar size={120} src={doctor.avatar} />
          </Col>

          <Col flex={1}>
            <h2>{doctor.name}</h2>
            <Tag color="blue">{doctor.specialization}</Tag>

            <p>{doctor.hospital}</p>

            <Rate disabled value={doctor.rating} />
            <span> ({doctor.reviews} đánh giá)</span>
          </Col>
        </Row>
      </Card>

      <Row gutter={24} style={{ marginTop: 20 }}>
        {/* LEFT */}
        <Col span={16}>
          {/* BOOKING */}
          <Card style={{ borderRadius: 12 }}>
            <h3>Đặt lịch khám</h3>

            <Divider />

            <Select
              defaultValue="today"
              style={{ width: 200, marginBottom: 20 }}
              options={[
                { value: "today", label: "Hôm nay" },
                { value: "tomorrow", label: "Ngày mai" },
              ]}
            />

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {schedules.map((time) => (
                <Button
                  key={time}
                  type={selectedTime === time ? "primary" : "default"}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </Button>
              ))}
            </div>

            <Button
              type="primary"
              style={{ marginTop: 20 }}
              disabled={!selectedTime}
            >
              Đặt lịch
            </Button>
          </Card>

          {/* INFO */}
          <Card style={{ marginTop: 20, borderRadius: 12 }}>
            <h3>Thông tin bác sĩ</h3>

            <p><b>Bằng cấp:</b> {doctor.degree}</p>
            <p><b>Kinh nghiệm:</b> {doctor.experience} năm</p>

            <p style={{ marginTop: 10 }}>{doctor.bio}</p>
          </Card>

          {/* REVIEWS */}
          <Card style={{ marginTop: 20, borderRadius: 12 }}>
            <h3>Đánh giá bệnh nhân</h3>

            <List
              itemLayout="vertical"
              dataSource={reviews}
              renderItem={(item) => (
                <List.Item>
                  <b>{item.name}</b>
                  <div>
                    <Rate disabled value={item.rating} />
                  </div>
                  <p>{item.comment}</p>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* RIGHT */}
        <Col span={8}>
          <Card style={{ borderRadius: 12 }}>
            <h3>Thông tin khám</h3>

            <p><b>Bệnh viện:</b> {doctor.hospital}</p>
            <p><b>Địa chỉ:</b> {doctor.address}</p>

            <p>
              <b>Giá khám:</b>{" "}
              <span style={{ color: "red" }}>{doctor.price}</span>
            </p>

            <Divider />

            <Button type="primary" block disabled={!selectedTime}>
              Đặt lịch ngay
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DoctorDetail;