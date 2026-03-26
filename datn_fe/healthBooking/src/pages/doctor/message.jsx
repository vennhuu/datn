import React from "react";
import { List, Avatar, Input } from "antd";

const Message = () => {
  const messages = [
    { name: "Bệnh nhân A", content: "Bác sĩ ơi em bị đau đầu" },
    { name: "Bệnh nhân B", content: "Cho em hỏi thuốc này dùng sao?" },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>💬 Tin nhắn</h2>

      <List
        dataSource={messages}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar>{item.name.charAt(0)}</Avatar>}
              title={item.name}
              description={item.content}
            />
          </List.Item>
        )}
      />

      <Input.Search placeholder="Nhập tin nhắn..." enterButton="Gửi" />
    </div>
  );
};

export default Message;