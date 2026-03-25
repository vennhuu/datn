import {
  Row,
  Col,
  Card,
  Input,
  Select,
  Rate,
  Button,
} from "antd";

const Hospital = () => {
  const hospitals = [
    {
      name: "Bệnh viện Bạch Mai",
      address: "Hà Nội",
      rating: 4.5,
      image: "https://picsum.photos/300/200",
    },
    {
      name: "Bệnh viện Chợ Rẫy",
      address: "TP.HCM",
      rating: 4,
      image: "https://picsum.photos/300/201",
    },
    {
      name: "Bệnh viện Việt Đức",
      address: "Hà Nội",
      rating: 4.2,
      image: "https://picsum.photos/300/202",
    },
    {
      name: "Bệnh viện Bạch Mai",
      address: "Hà Nội",
      rating: 4.5,
      image: "https://picsum.photos/300/200",
    },
    {
      name: "Bệnh viện Chợ Rẫy",
      address: "TP.HCM",
      rating: 4,
      image: "https://picsum.photos/300/201",
    },
    {
      name: "Bệnh viện Việt Đức",
      address: "Hà Nội",
      rating: 4.2,
      image: "https://picsum.photos/300/202",
    },
    {
      name: "Bệnh viện Bạch Mai",
      address: "Hà Nội",
      rating: 4.5,
      image: "https://picsum.photos/300/200",
    },
    {
      name: "Bệnh viện Chợ Rẫy",
      address: "TP.HCM",
      rating: 4,
      image: "https://picsum.photos/300/201",
    },
    {
      name: "Bệnh viện Việt Đức",
      address: "Hà Nội",
      rating: 4.2,
      image: "https://picsum.photos/300/202",
    },
  ];

  return (
    <div style={{ padding: "40px 80px" }}>
      <h2>Danh sách bệnh viện</h2>

      {/* SEARCH + FILTER */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={12}>
          <Input.Search placeholder="Tìm bệnh viện..." />
        </Col>

        <Col span={6}>
          <Select style={{ width: "100%" }} placeholder="Chọn địa điểm">
            <Select.Option value="hn">Hà Nội</Select.Option>
            <Select.Option value="hcm">TP.HCM</Select.Option>
          </Select>
        </Col>
      </Row>

      {/* LIST */}
      <Row gutter={[16, 16]}>
        {hospitals.map((item, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Card
              hoverable
              cover={
                <img
                  src={item.image}
                  alt=""
                  style={{ height: 180, objectFit: "cover" }}
                />
              }
              style={{ borderRadius: 12 }}
            >
              <h3>{item.name}</h3>

              <p>📍 {item.address}</p>

              <Rate disabled defaultValue={item.rating} />

              <div style={{ marginTop: 10 }}>
                <Button type="primary">
                  Xem chi tiết
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Hospital;