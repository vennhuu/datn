import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchHospitalByIdAPI } from "../../services/api.service.hospital";
import { Rate, Spin } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";

const HospitalDetail = () => {

    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    console.log("id" , id)

    useEffect(() => {
        loadHospital();
    }, [id]);

    const loadHospital = async () => {
        setLoading(true);
        const res = await fetchHospitalByIdAPI(id);
        if (res.data) {
            setData(res.data);
        }
        setLoading(false);
    };

    if (loading) return <Spin />;

    if (!data) return <p>Không có dữ liệu</p>;

    return (
        <div style={{ padding: "40px 80px", fontFamily: "Be Vietnam Pro" }}>
            
            {/* HEADER */}
            <div style={{
                display: "flex",
                gap: 20,
                marginBottom: 30,
                background: "#fff",
                padding: 20,
                borderRadius: 16,
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
            }}>
                <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/storage/logo_hospital/${data.logo}`}
                    alt=""
                    style={{
                        width: 120,
                        height: 120,
                        objectFit: "cover",
                        borderRadius: 12
                    }}
                />

                <div>
                    <h2 style={{ marginBottom: 10 }}>{data.name}</h2>

                    <p style={{ color: "#64748b" }}>
                        <EnvironmentOutlined /> {data.address}
                    </p>

                    <Rate disabled value={data.rating} allowHalf />
                </div>
            </div>

            {/* INTRODUCTION */}
            <div style={{
                background: "#fff",
                padding: 20,
                borderRadius: 16,
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
            }}>
                <h3>Giới thiệu</h3>

                <p style={{
                    lineHeight: 1.7,
                    color: "#334155"
                }}>
                    {data.introduction}
                </p>
            </div>
        </div>
    );
};

export default HospitalDetail;