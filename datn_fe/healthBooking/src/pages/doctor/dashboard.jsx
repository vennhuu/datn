import React from "react";
import { Card, Col, Row, List, Avatar, Tag } from "antd";

const DashboardDoctor = () => {
  const stats = [
    { title: "Lịch hôm nay", value: 12 },
    { title: "Đã khám", value: 8 },
    { title: "Bệnh nhân mới", value: 5 },
    { title: "Tin nhắn", value: 3 },
  ];

  const appointments = [
    {
      name: "Nguyễn Văn A",
      time: "09:00",
      status: "Đã xác nhận",
    },
    {
      name: "Trần Thị B",
      time: "10:30",
      status: "Chờ khám",
    },
    {
      name: "Lê Văn C",
      time: "14:00",
      status: "Đã khám",
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>👨‍⚕️ Dashboard bác sĩ</h2>

      {/* Stats */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
        {stats.map((item, index) => (
          <Col span={6} key={index}>
            <Card>
              <h3>{item.title}</h3>
              <p style={{ fontSize: 24, fontWeight: "bold" }}>
                {item.value}
              </p>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Lịch hôm nay */}
      <Card title="📅 Lịch khám hôm nay">
        <List
          itemLayout="horizontal"
          dataSource={appointments}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar>{item.name.charAt(0)}</Avatar>}
                title={item.name}
                description={`Giờ khám: ${item.time}`}
              />
              <Tag
                color={
                  item.status === "Đã khám"
                    ? "green"
                    : item.status === "Chờ khám"
                    ? "orange"
                    : "blue"
                }
              >
                {item.status}
              </Tag>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default DashboardDoctor;