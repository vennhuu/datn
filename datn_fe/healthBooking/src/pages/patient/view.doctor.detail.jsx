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
  Spin,
} from "antd";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchDoctorByIdAPI } from "../../services/api.service.doctor";

const DoctorDetail = () => {
  const { id } = useParams();

  const [selectedTime, setSelectedTime] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  const schedules = [
    "09:00 - 09:30",
    "09:30 - 10:00",
    "10:00 - 10:30",
    "10:30 - 11:00",
    "11:00 - 11:30",
    "13:30 - 14:00",
    "14:00 - 14:30",
    "14:30 - 15:00",
    "15:00 - 15:30",
    "15:30 - 16:00",
  ];

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await fetchDoctorByIdAPI(id);
        setDoctor(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  if (loading) return <Spin fullscreen />;
  if (!doctor) return <p>Không tìm thấy bác sĩ</p>;

  console.log("doctor" , doctor) ;
  return (
    <div style={{ background: "#f0f2f5", padding: "30px 100px" }}>
      
      {/* HEADER */}
      <Card style={{ borderRadius: 12 }}>
        <Row gutter={20} align="middle">
          <Col>
            <Avatar
              size={100}
              src={`${import.meta.env.VITE_BACKEND_URL}/storage/avt_doctor/${doctor.avatar}`}
            />
          </Col>

          <Col flex={1}>
            <h2 style={{ marginBottom: 5 }}>{doctor.user?.name}</h2>

            <Tag color="processing">{doctor.specialization}</Tag>

            <p style={{ margin: "5px 0", color: "#555" }}>
              <Link to>{doctor.hospital?.name}</Link>
            </p>

            <Rate disabled allowHalf value={4.5} />
            <span style={{ marginLeft: 8, color: "#888" }}>
              (150 đánh giá)
            </span>
          </Col>
        </Row>
      </Card>

      <Row gutter={24} style={{ marginTop: 20 }}>
        
        {/* LEFT */}
        <Col span={16}>
          
          {/* BOOKING */}
          <Card style={{ borderRadius: 12 }}>
            <h3 style={{ color: "#1890ff" }}>Lịch khám</h3>

            <Divider />

            <Select
              defaultValue="today"
              style={{ width: 220, marginBottom: 20 }}
              options={[
                { value: "today", label: "Thứ 3 - Hôm nay" },
                { value: "tomorrow", label: "Ngày mai" },
              ]}
            />

            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {schedules.map((time) => (
                <div
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  onMouseEnter={(e) => {
                    if (selectedTime !== time) {
                      e.currentTarget.style.background = "#e6f7ff";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedTime !== time) {
                      e.currentTarget.style.background = "#f5f5f5";
                    }
                  }}
                  style={{
                    padding: "10px 18px",
                    borderRadius: 6,
                    cursor: "pointer",
                    border: "1px solid #d9d9d9",
                    background:
                      selectedTime === time ? "#1890ff" : "#f5f5f5",
                    color: selectedTime === time ? "#fff" : "#333",
                    fontWeight: 500,
                    minWidth: 130,
                    textAlign: "center",
                    transition: "all 0.2s",
                  }}
                >
                  {time}
                </div>
              ))}
            </div>

            <p style={{ marginTop: 10, color: "#888", fontSize: 13 }}>
              Chọn ☝ và đặt (Phí đặt lịch 0đ)
            </p>

            <Button
              type="primary"
              size="large"
              block
              style={{
                marginTop: 20,
                borderRadius: 8,
                height: 45,
                fontWeight: "bold",
              }}
              disabled={!selectedTime}
            >
              Đặt lịch khám
            </Button>
          </Card>

          {/* INFO */}
          <Card style={{ marginTop: 20, borderRadius: 12 }}>
            <h3>Thông tin bác sĩ</h3>

            <p><b>Bằng cấp:</b> {doctor.degree}</p>
            <p><b>Kinh nghiệm:</b> {doctor.experienceYears} năm</p>
            <p style={{ color: "#555" }}>{doctor.bio}</p>
          </Card>
        </Col>

        {/* RIGHT */}
        <Col span={8}>
          <div style={{ position: "sticky", top: 20 }}>
            <Card style={{ borderRadius: 12 }}>
              <h3>Địa chỉ khám</h3>

              <p style={{ fontWeight: "bold", color: "#1890ff" }}>
                <Link to={`/hospital/${doctor.hospital.id}`}>{doctor.hospital.name}</Link>
              </p>

              <p>{doctor.hospital.address}</p>

              <Divider />

              <p>
                <b>Giá khám:</b>{" "}
                <span style={{ color: "red", fontWeight: "bold" }}>
                  {doctor.price} VND
                </span>
              </p>

              <Divider />

              <Button
                type="primary"
                block
                size="large"
                disabled={!selectedTime}
                style={{
                  borderRadius: 8,
                  height: 45,
                  fontWeight: "bold",
                }}
              >
                Đặt lịch ngay
              </Button>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default DoctorDetail;