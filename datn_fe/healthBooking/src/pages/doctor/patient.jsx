import React from "react";
import { Table } from "antd";

const ListPatient = () => {
  const columns = [
    { title: "Tên", dataIndex: "name" },
    { title: "SĐT", dataIndex: "phone" },
    { title: "Giới tính", dataIndex: "gender" },
  ];

  const data = [
    { key: 1, name: "Nguyễn Văn A", phone: "0123456789", gender: "Nam" },
    { key: 2, name: "Trần Thị B", phone: "0987654321", gender: "Nữ" },
  ];

  return (
    <div>
      <h2>👤 Danh sách bệnh nhân</h2>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default ListPatient;