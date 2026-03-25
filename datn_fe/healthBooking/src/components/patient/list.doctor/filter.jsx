import { Card, Col, Select, Slider } from "antd";

const Filter = () => {
    return(
        <Col span={6}>
          <Card title="Bộ lọc">
            <p>Chuyên khoa</p>
            <Select style={{ width: "100%" }}>
              <Select.Option value="tim-mach">Tim mạch</Select.Option>
              <Select.Option value="da-lieu">Da liễu</Select.Option>
            </Select>

            <p style={{ marginTop: 20 }}>Giá khám</p>
            <Slider min={100000} max={1000000} />

            {/* <p style={{ marginTop: 20 }}>Đánh giá</p>
            <Rate /> */}
          </Card>
        </Col>
    )
}

export default Filter ;