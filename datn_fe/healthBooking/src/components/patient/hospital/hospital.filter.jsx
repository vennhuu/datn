import { Col, Input, Row, Select } from "antd";

const HospitalFilter = () => {
    return (
        <>
            <h2>Danh sách bệnh viện</h2>

            {/* SEARCH + FILTER */}
            <Row gutter={16} style={{ marginBottom: 20 }}>
                <Col span={12}>
                <Input.Search placeholder="Tìm bệnh viện..." />
                </Col>

                <Col span={6}>
                <Select style={{ width: "100%" }} placeholder="Chọn địa điểm">
                    <Select.Option value="HA_NOI">Hà Nội</Select.Option>
                    <Select.Option value="HO_CHI_MINH">TP.HCM</Select.Option>
                    <Select.Option value="DA_NANG">Đà nẵng</Select.Option>
                </Select>
                </Col>
            </Row>
        </>
    )
}

export default HospitalFilter ;