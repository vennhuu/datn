import { Button, Card, Col, Input, Select, Slider } from "antd";
import { useState } from "react";
import { SPECIALIZATION_LABEL } from "../../../constant/doctor.constant";

const Filter = (props) => {
    const { setFilters } = props;

    const [name, setName] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [hospital, setHospital] = useState("");
    const [priceRange, setPriceRange] = useState([100000, 1000000]);

    const handleSearch = () => {
        setFilters({
            name,
            specialization,
            hospital,
            minPrice: priceRange[0],
            maxPrice: priceRange[1],
        });
    };

    const handleReset = () => {
        setName("");
        setSpecialization("");
        setHospital("");
        // setPriceRange([100000, 1000000]);
        setFilters({});
    };

    return (
        <Col span={6}>
            <Card title="Bộ lọc">

                <p>Tên bác sĩ</p>
                <Input
                    placeholder="Nhập tên bác sĩ..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <p style={{ marginTop: 16 }}>Chuyên khoa</p>
                <Select
                    style={{ width: "100%" }}
                    placeholder="Chọn chuyên khoa"
                    allowClear
                    value={specialization || undefined}
                    onChange={(value) => setSpecialization(value || "")}
                >
                    {Object.entries(SPECIALIZATION_LABEL).map(([key, label]) => (
                        <Select.Option key={key} value={key}>{label}</Select.Option>
                    ))}
                </Select>

                <p style={{ marginTop: 16 }}>Địa điểm (Bệnh viện)</p>
                <Select
                  style={{ width: "100%" }}
                  value={hospital}
                  onChange={(value) => setHospital(value)}
                  placeholder="Chọn bệnh viện"
                  options={[
                    { label: 'Bệnh viện Bạch Mai', value: 'Bệnh viện Bạch Mai' },
                    { label: 'Bệnh viện Hữu Nghị Việt Đức', value: 'Bệnh viện Hữu Nghị Việt Đức' },
                    { label: 'Bệnh viện Phụ Sản Hà Nội', value: 'Bệnh viện Phụ Sản Hà Nội' },
                    { label: 'Bệnh viện Đa khoa Đà Nẵng', value: 'Bệnh viện Đa khoa Đà Nẵng' },
                    { label: 'Bệnh viện C Đà Nẵng', value: 'Bệnh viện C Đà Nẵng' },
                    { label: 'Bệnh viện Hoàn Mỹ Đà Nẵng', value: 'Bệnh viện Hoàn Mỹ Đà Nẵng' },
                    { label: 'Bệnh viện Chợ Rẫy', value: 'Bệnh viện Chợ Rẫy' },
                    { label: 'Bệnh viện Đại học Y Dược TP.HCM', value: 'Bệnh viện Đại học Y Dược TP.HCM' },
                    { label: 'Bệnh viện Nhân dân 115', value: 'Bệnh viện Nhân dân 115' },
                    { label: 'Bệnh viện FV', value: 'Bệnh viện FV' }
                  ]}
                />

                <p style={{ marginTop: 16 }}>
                    Giá khám: {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()} VNĐ
                </p>
                <Slider
                    range
                    min={100000}
                    max={1000000}
                    step={50000}
                    value={priceRange}
                    onChange={(value) => setPriceRange(value)}
                />

                <Button type="primary" block style={{ marginTop: 16 }} onClick={handleSearch}>
                    Tìm kiếm
                </Button>
                <Button block style={{ marginTop: 8 }} onClick={handleReset}>
                    Xóa bộ lọc
                </Button>

            </Card>
        </Col>
    );
};

export default Filter;