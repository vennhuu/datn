import { Button, Col, Empty, Rate, Row, Tag } from "antd";
import {
  EnvironmentOutlined,
  ArrowRightOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const ListHospital = (props) => {
  const { dataHospital } = props;

  if (!Array.isArray(dataHospital)) {
    return <Empty description="Dữ liệu không hợp lệ" />;
  }

  if (dataHospital.length === 0) {
    return <Empty description="Không có bệnh viện" />;
  }

  const getRatingLabel = (rating) => {
    if (rating >= 4.5) return { label: "Xuất sắc", color: "#0ea5e9" };
    if (rating >= 4.0) return { label: "Rất tốt", color: "#22c55e" };
    if (rating >= 3.0) return { label: "Tốt", color: "#f59e0b" };
    return { label: "Trung bình", color: "#94a3b8" };
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap');

        .hospital-grid {
          font-family: 'Be Vietnam Pro', sans-serif;
        }

        .hospital-card {
          display: flex;
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #e8f0fe;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          height: 160px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .hospital-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(14, 165, 233, 0.15);
          border-color: #bae0ff;
        }

        .hospital-card__image-wrap {
          width: 160px;
          min-width: 160px;
          overflow: hidden;
          position: relative;
          background: #f0f9ff;
        }

        .hospital-card__image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.35s ease;
        }

        .hospital-card:hover .hospital-card__image-wrap img {
          transform: scale(1.06);
        }

        .hospital-card__badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: #0ea5e9;
          color: white;
          font-size: 10px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 20px;
          letter-spacing: 0.4px;
        }

        .hospital-card__body {
          flex: 1;
          padding: 16px 18px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
        }

        .hospital-card__top {}

        .hospital-card__name {
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 6px 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .hospital-card__address {
          display: flex;
          align-items: flex-start;
          gap: 5px;
          font-size: 12px;
          color: #64748b;
          margin: 0;
          line-height: 1.5;

          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .hospital-card__address .anticon {
          color: #0ea5e9;
          margin-top: 2px;
          flex-shrink: 0;
        }

        .hospital-card__bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .hospital-card__rating {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .hospital-card__rating .ant-rate {
          font-size: 12px;
        }

        .hospital-card__rating-label {
          font-size: 11px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 20px;
          color: white;
        }

        .hospital-card__btn {
          border: none;
          background: #f0f9ff;
          color: #0ea5e9;
          font-size: 12px;
          font-weight: 600;
          padding: 0 12px;
          height: 30px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;
          transition: background 0.2s, color 0.2s;
          font-family: 'Be Vietnam Pro', sans-serif;
        }

        .hospital-card__btn:hover {
          background: #0ea5e9;
          color: white;
        }
      `}</style>

      <Row gutter={[20, 16]} className="hospital-grid">
        {dataHospital.map((item, index) => {
          const { label, color } = getRatingLabel(item.rating);
          return (
            <Col xs={24} md={12} key={index}>
              <div className="hospital-card">
                {/* Image */}
                <div className="hospital-card__image-wrap">
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/storage/logo_hospital/${item.logo}`}
                    alt={item.name}
                  />
                  <span className="hospital-card__badge">
                    <MedicineBoxOutlined /> Bệnh viện
                  </span>
                </div>

                {/* Body */}
                <div className="hospital-card__body">
                  <div className="hospital-card__top">
                    <h3 className="hospital-card__name">{item.name}</h3>
                    <p className="hospital-card__address">
                      <EnvironmentOutlined />
                      {item.address}
                    </p>
                  </div>

                  <div className="hospital-card__bottom">
                    <div className="hospital-card__rating">
                      <Rate
                        disabled
                        defaultValue={item.rating}
                        allowHalf
                      />
                      <span
                        className="hospital-card__rating-label"
                        style={{ background: color }}
                      >
                        {label}
                      </span>
                    </div>

                    <Link to={`/hospital/${item.id}`}>
                      <button className="hospital-card__btn">
                        Chi tiết <ArrowRightOutlined />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>
    </>
  );
};

export default ListHospital;