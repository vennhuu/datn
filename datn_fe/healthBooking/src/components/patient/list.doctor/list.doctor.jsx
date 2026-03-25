import { Avatar, Button, Card, Col, Rate, Row } from "antd";

const ListDoctors = () => {

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
    return(
        <Col span={18}>
          <Row gutter={[16, 16]}>
            {doctors.map((doc, index) => (
              <Col span={12} key={index}>
                <Card hoverable>
                  <div style={{ display: "flex", gap: 16 }}>
                    
                    {/* AVATAR */}
                    <Avatar size={80} />

                    {/* INFO */}
                    <div style={{ flex: 1 }}>
                      <h3>{doc.name}</h3>
                      <p>{doc.specialty}</p>
                      <p>Kinh nghiệm: {doc.exp}</p>
                      <Rate disabled defaultValue={doc.rating} />

                      <p style={{ marginTop: 10 }}>
                        Giá: {doc.price.toLocaleString()} VNĐ
                      </p>

                      <Button type="primary">
                        Đặt lịch
                      </Button>
                    </div>

                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
    )
}
export default ListDoctors ;