import { Card, Avatar, Button, Row, Col } from "antd";
import { UserOutlined } from "@ant-design/icons";

const Profile = () => {

  // giả lập data (sau này gọi API)
  const user = {
    name: "Nguyễn Văn A",
    email: "a@gmail.com",
    gender: "Nam",
    mobile: "0123456789",
    birthday: "01/01/2000",
    address: "Hà Nội",
    about: "Bệnh nhân thường xuyên khám định kỳ",
    avatar: "",
  };
  return (
    <div style={{ padding: 40, maxWidth: 900, margin: "0 auto" }}>
      <Card>
        <Row gutter={20}>

          {/* AVATAR */}
          <Col span={6} style={{ textAlign: "center" }}>
            <Avatar
              size={120}
              icon={<UserOutlined />}
              src={user.avatar}
            />
            <h3 style={{ marginTop: 10 }}>{user.name}</h3>
          </Col>

          {/* INFO */}
          <Col span={18}>
            <Row gutter={16}>
              <Col span={12}>
                <p><b>Email:</b> {user.email}</p>
              </Col>
              <Col span={12}>
                <p><b>Số điện thoại:</b> {user.mobile}</p>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <p><b>Giới tính:</b> {user.gender}</p>
              </Col>
              <Col span={12}>
                <p><b>Ngày sinh:</b> {user.birthday}</p>
              </Col>
            </Row>

            <Row>
              <Col span={24}>
                <p><b>Địa chỉ:</b> {user.address}</p>
              </Col>
            </Row>

            <Row>
              <Col span={24}>
                <p><b>Giới thiệu:</b> {user.about}</p>
              </Col>
            </Row>

            <div style={{ marginTop: 20 }}>
              <Button type="primary" style={{ background: "#2f6fa3" }}>
                Cập nhật thông tin
              </Button>
            </div>
          </Col>

        </Row>
      </Card>
    </div>
  );
};

export default Profile;