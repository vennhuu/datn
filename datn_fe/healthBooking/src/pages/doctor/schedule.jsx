import React from "react";
import { Card, List, Tag } from "antd";

const Schedule = () => {
  const schedules = [
    { name: "Nguyễn Văn A", time: "09:00", status: "Đã xác nhận" },
    { name: "Trần Thị B", time: "10:30", status: "Chờ khám" },
  ];

  return (
    <Card title="📅 Lịch khám">
      <List
        dataSource={schedules}
        renderItem={(item) => (
          <List.Item>
            <div>
              <b>{item.name}</b> - {item.time}
            </div>
            <Tag color="blue">{item.status}</Tag>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default Schedule;