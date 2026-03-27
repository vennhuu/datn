import { Col, Input, Row, Select } from "antd";

const HospitalFilter = (props) => {
    const {setFilters} = props ;

    const handleSearch = (value) => {
        setFilters(prev => ({
            ...prev,
            name: value
        }));
    };

    const handleChangeCity = (value) => {
        setFilters(prev => ({
            ...prev,
            city: value
        }));
    };
    return (
        <>
            <h2>Danh sách bệnh viện</h2>

            {/* SEARCH + FILTER */}
            <Row gutter={16} style={{ marginBottom: 20 }}>
                <Col span={12}>
                <Input.Search 
                    placeholder="Tìm bệnh viện..." 
                    onSearch={handleSearch}
                />
                </Col>

                <Col span={6}>
                <Select 
                    style={{ width: "100%" }} 
                    placeholder="Chọn địa điểm" 
                    onChange={handleChangeCity}>
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