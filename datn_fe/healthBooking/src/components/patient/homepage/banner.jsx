import { Input } from "antd";
import banner from "../../../assets/banner.jpg";

const Banner = () => {
    return(
        <div
            style={{
                position: "relative",
                height: 400,
            }}
            >
            {/* IMAGE */}
            <img
                src={banner}
                alt="doctor"
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                }}
            />

            {/* OVERLAY */}
            <div
                style={{
                position: "absolute",
                top: "50%",
                left: "10%",
                transform: "translateY(-50%)",
                color: "#000",
                maxWidth: 500,
                }}
            >
                <h1>Đặt lịch khám bác sĩ nhanh chóng</h1>
                <p>Chọn bác sĩ phù hợp – không cần chờ đợi</p>

                <Input.Search
                    placeholder="Tìm bác sĩ, chuyên khoa..."
                    enterButton="Tìm kiếm"
                    size="large"
                    style={{ marginTop: 20 }}
                />
            </div>
        </div>
    )
}
export default Banner ;