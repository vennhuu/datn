import { CalendarOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row } from "antd";

const ListDoctor = () => {
    return (
        <>
            <h2 style={{ marginTop: 40 }}>Bác sĩ nổi tiếng</h2>
            <Row gutter={[16, 16]}>
                {[1, 2, 3, 4].map((_, index) => (
                    <Col span={6} key={index}>
                        <Card
                            hoverable
                            cover={
                                <img
                                    alt="doctor"
                                    src="https://via.placeholder.com/300x200"
                                />
                            }
                        >
                            <h3>BS. Nguyễn Văn A</h3>
                            <p>Chuyên khoa Tim mạch</p>
                            <Button type="primary" icon={<CalendarOutlined />}>
                                Đặt lịch
                            </Button>
                        </Card>
                    </Col>
                ))}
            </Row>
        </>
    )
}
export default ListDoctor;