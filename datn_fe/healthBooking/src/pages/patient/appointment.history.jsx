import { Table, Tag } from "antd";

const AppointmentHistory = () => {

  const columns = [
    {
      title: "Bác sĩ",
      dataIndex: "doctor",
    },
    {
      title: "Bệnh viện",
      dataIndex: "hospital",
    },
    {
      title: "Ngày khám",
      dataIndex: "date",
    },
    {
      title: "Giờ",
      dataIndex: "time",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => {
        let color = "blue";

        if (status === "CONFIRMED") color = "green";
        if (status === "PENDING") color = "orange";
        if (status === "CANCELLED") color = "red";

        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  const data = [
    {
      key: 1,
      doctor: "Nguyễn Văn A",
      hospital: "Bệnh viện Bạch Mai",
      date: "25/03/2026",
      time: "08:00",
      status: "CONFIRMED",
    },
    {
      key: 2,
      doctor: "Trần Thị B",
      hospital: "Bệnh viện Việt Đức",
      date: "26/03/2026",
      time: "10:00",
      status: "PENDING",
    },
    {
      key: 3,
      doctor: "Lê Văn C",
      hospital: "Bệnh viện 108",
      date: "27/03/2026",
      time: "14:00",
      status: "CANCELLED",
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>Lịch sử đặt khám</h2>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default AppointmentHistory;