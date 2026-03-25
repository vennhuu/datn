import { Card, Col, Row } from "antd";

const ScheduleProcess = () => {
    return(
        <>
            <h2 style={{ marginTop: 40 }}>Quy trình đặt lịch</h2>
            <Row gutter={[16, 16]}>
                {[
                    "Tìm bác sĩ",
                    "Chọn lịch",
                    "Nhập thông tin",
                    "Xác nhận",
                ].map((step, index) => (
                    <Col span={6} key={index}>
                        <Card style={{ textAlign: "center" }}>
                            <h3>Bước {index + 1}</h3>
                            <p>{step}</p>
                        </Card>
                    </Col>
                ))}
            </Row>
        </>
    )
}
export default ScheduleProcess ;