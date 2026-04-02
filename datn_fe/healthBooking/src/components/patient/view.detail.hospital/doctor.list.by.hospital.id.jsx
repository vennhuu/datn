import { Button, Empty } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";

const DoctorListByHospitalId = ({ doctors }) => {

    if (!doctors || doctors.length === 0) {
        return <Empty description="Chưa có bác sĩ" />;
    }

    // fake data lịch khám (sau này bạn thay bằng API)
    const schedules = [
        "08:00 - 08:30",
        "08:30 - 09:00",
        "09:00 - 09:30",
        "09:30 - 10:00",
        "10:00 - 10:30",
        "10:30 - 11:00",
        "13:30 - 14:00",
        "14:00 - 14:30",
        "14:30 - 15:00",
    ];

    return (
        <div style={{ marginTop: 30 }}>
            <h3 style={{ marginBottom: 20 }}>Danh sách bác sĩ</h3>

            {doctors.map((doc) => (
                <div
                    key={doc.id}
                    style={{
                        display: "flex",
                        background: "#fff",
                        borderRadius: 16,
                        overflow: "hidden",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                        marginBottom: 20
                    }}
                >
                    {/* LEFT */}
                    <div style={{
                        flex: 1,
                        padding: 20,
                        display: "flex",
                        gap: 15
                    }}>
                        {/* Avatar */}
                        <img
                            src={`${import.meta.env.VITE_BACKEND_URL}/storage/avt_doctor/${doc.avatar}`}
                            alt=""
                            style={{
                                width: 80,
                                height: 80,
                                borderRadius: "50%",
                                objectFit: "cover"
                            }}
                        />

                        {/* Info */}
                        <div>
                            <h3 style={{
                                marginBottom: 5,
                                color: "#0ea5e9"
                            }}>
                                {doc.degree} {doc.name}
                            </h3>

                            <p style={{
                                color: "#475569",
                                fontSize: 14,
                                lineHeight: 1.6,
                                maxWidth: 400
                            }}>
                                {doc.bio || "Chưa có mô tả"}
                            </p>

                            <p style={{
                                marginTop: 10,
                                color: "#64748b"
                            }}>
                                <EnvironmentOutlined /> {doc.hospitalName || "Hà Nội"}
                            </p>

                            <Button
                                style={{
                                    marginTop: 10,
                                    borderRadius: 20,
                                    borderColor: "#0ea5e9",
                                    color: "#0ea5e9"
                                }}
                            >
                                🤖 Tư vấn sâu
                            </Button>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div style={{
                        width: 350,
                        borderLeft: "1px solid #eee",
                        padding: 20
                    }}>
                        <h4 style={{ marginBottom: 10 }}>
                            Thứ 3 - 31/3
                        </h4>

                        <p style={{
                            fontWeight: 600,
                            marginBottom: 10
                        }}>
                            📅 LỊCH KHÁM
                        </p>

                        {/* time slots */}
                        <div style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 10
                        }}>
                            {schedules.map((time, index) => (
                                <div
                                    key={index}
                                    style={{
                                        padding: "8px 10px",
                                        background: "#f1f5f9",
                                        borderRadius: 6,
                                        fontSize: 13,
                                        cursor: "pointer"
                                    }}
                                >
                                    {time}
                                </div>
                            ))}
                        </div>

                        <p style={{
                            marginTop: 10,
                            fontSize: 12,
                            color: "#64748b"
                        }}>
                            Chọn và đặt (Phí đặt lịch 0đ)
                        </p>

                        <hr style={{ margin: "15px 0" }} />

                        <p style={{ fontWeight: 600 }}>
                            ĐỊA CHỈ KHÁM
                        </p>

                        <p style={{ margin: "5px 0" }}>
                            {doc.hospitalName || "Bệnh viện"}
                        </p>

                        <p style={{ color: "#64748b", fontSize: 13 }}>
                            {doc.address || "Địa chỉ đang cập nhật"}
                        </p>

                        <hr style={{ margin: "15px 0" }} />

                        <p>
                            <b>GIÁ KHÁM:</b> 300.000đ
                        </p>

                        <p style={{ color: "#0ea5e9", cursor: "pointer" }}>
                            Xem chi tiết
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DoctorListByHospitalId;