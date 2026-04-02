import { Avatar, Button, Card, Col, Pagination, Rate, Row } from "antd";
import { SPECIALIZATION_LABEL } from "../../../constant/doctor.constant";
import { Link } from "react-router-dom";

const ListDoctors = (props) => {
    const { dataDoctor, current, pageSize, total, setCurrent, setPageSize } = props;

    return (
        <Col span={18}>
            <Row gutter={[16, 16]}>
                {dataDoctor.map((doc, index) => (
                    <Col span={12} key={index}>
                        <Card hoverable>
                            <div style={{ display: "flex", gap: 16 }}>
                                <Avatar size={80}
                                    src={`${import.meta.env.VITE_BACKEND_URL}/storage/avt_doctor/${doc.avatar}`} />
                                <div style={{ flex: 1 }}>
                                    <h3>{doc.name}</h3>
                                    <p>{SPECIALIZATION_LABEL[doc.specialization] || doc.specialization}</p> {/* ✅ */}
                                    <p>Kinh nghiệm: {doc.experienceYears} năm</p>
                                    <Rate disabled defaultValue={doc.rating} />
                                    <p>Giá: {doc.price?.toLocaleString() || "Đang cập nhật"} VNĐ</p>
                                    <Link to={`/doctors/${doc.id}`}>
                                        <Button type="primary">
                                            Đặt lịch
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* PHÂN TRANG */}
            <Row justify="center" style={{ marginTop: 24 }}>
                <Pagination
                    current={current}
                    pageSize={pageSize}
                    total={total}
                    showSizeChanger
                    onChange={(page, size) => {
                        setCurrent(page);
                        if (size !== pageSize) setPageSize(size);
                    }}
                />
            </Row>
        </Col>
    );
};

export default ListDoctors;