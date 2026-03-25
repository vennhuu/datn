import { CalendarOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row } from "antd";

const ListHospital = () => {
    return (
        <>
            <h2 style={{ marginTop: 40 }}>Cơ sở y tế</h2>
            <Row gutter={[16, 16]}>
                {[1, 2, 3, 4].map((_, index) => (
                    <Col span={6} key={index}>
                        <Card
                            hoverable
                            cover={
                                <img
                                    alt="hospital"
                                    src="https://via.placeholder.com/300x200"
                                />
                            }
                        >
                            <h3>Bệnh viện A</h3>
                        </Card>
                    </Col>
                ))}
            </Row>
        </>
    )
}

export default ListHospital ;