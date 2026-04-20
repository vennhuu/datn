import {
  CalendarOutlined,
  MedicineBoxOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Spin, Table, Tag, Typography } from "antd";
import { useEffect, useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import axios from "../../services/axios.customize";

const { Title, Text } = Typography;

const STATUS_CONFIG = {
  PENDING:   { label: "Chờ xác nhận", color: "#EF9F27", tagColor: "orange" },
  CONFIRMED: { label: "Đã xác nhận",  color: "#378ADD", tagColor: "blue"   },
  DONE:      { label: "Hoàn thành",   color: "#639922", tagColor: "green"  },
  CANCELLED: { label: "Đã huỷ",       color: "#E24B4A", tagColor: "red"    },
};

const COLUMNS = [
  { title: "Bệnh nhân",  dataIndex: "patientName",  key: "patientName"  },
  { title: "Bác sĩ",     dataIndex: "doctorName",   key: "doctorName"   },
  { title: "Bệnh viện",  dataIndex: "hospitalName", key: "hospitalName" },
  {
    title: "Ngày hẹn",
    dataIndex: "appointmentDate",
    key: "appointmentDate",
    render: (d) => d ? new Date(d).toLocaleDateString("vi-VN") : "—",
    sorter: (a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate),
  },
  {
    title: "Khung giờ",
    dataIndex: "timeSlot",
    key: "timeSlot",
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    filters: Object.entries(STATUS_CONFIG).map(([k, v]) => ({ text: v.label, value: k })),
    onFilter: (value, record) => record.status === value,
    render: (status) => {
      const cfg = STATUS_CONFIG[status] || { label: status, tagColor: "default" };
      return <Tag color={cfg.tagColor}>{cfg.label}</Tag>;
    },
  },
];

const StatCard = ({ title, value, icon, color, sub }) => (
  <Card style={{ borderRadius: 12, height: "100%" }}>
    <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
      <div style={{
        width: 48, height: 48, borderRadius: 10,
        background: `${color}20`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 22, color, flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <Text type="secondary" style={{ fontSize: 13 }}>{title}</Text>
        <div style={{ fontSize: 28, fontWeight: 500, lineHeight: 1.3, marginTop: 4 }}>
          {value !== null ? (value?.toLocaleString?.() ?? value) : <Spin size="small" />}
        </div>
        {sub && <Text type="secondary" style={{ fontSize: 12 }}>{sub}</Text>}
      </div>
    </div>
  </Card>
);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({ users: null, doctors: null, hospitals: null });
  // aptStats: { PENDING: 0, CONFIRMED: 0, DONE: 0, CANCELLED: 0 }
  const [aptStats, setAptStats] = useState(null);
  // Tất cả lịch hẹn của admin (dùng endpoint /doctor nếu có, hoặc tạo /admin/appointments)
  const [allApts, setAllApts] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const results = await Promise.allSettled([
        axios.get("/api/v1/users/count"),
        axios.get("/api/v1/doctors/count"),
        axios.get("/api/v1/hospitals/count"),
        axios.get("/api/v1/appointments/stats"),
        axios.get("/api/v1/appointments/admin/all"),
      ]);

      const [usersR, doctorsR, hospitalsR, statsR, allAptsR] = results;

      setCounts({
        users:     usersR.status     === "fulfilled" ? usersR.value.data     : "—",
        doctors:   doctorsR.status   === "fulfilled" ? doctorsR.value.data   : "—",
        hospitals: hospitalsR.status === "fulfilled" ? hospitalsR.value.data : "—",
      });

      if (statsR.status === "fulfilled") {
        setAptStats(statsR.value.data); // { PENDING: N, CONFIRMED: N, DONE: N, CANCELLED: N }
      }

      if (allAptsR.status === "fulfilled") {
        setAllApts(allAptsR.value.data || []);
      }

      setLoading(false);
    };

    fetchAll();
  }, []);

  // Tổng lịch hẹn từ stats
  const totalApts = aptStats
    ? Object.values(aptStats).reduce((s, v) => s + v, 0)
    : null;

  // Lịch hẹn hôm nay tính từ allApts
  const today = new Date().toISOString().split("T")[0];
  const todayApts = allApts.filter((a) => a.appointmentDate === today);
  const todayPending = todayApts.filter((a) => a.status === "PENDING").length;

  // Pie chart data từ /appointments/stats
  const pieData = aptStats
    ? Object.entries(aptStats)
        .filter(([, v]) => v > 0)
        .map(([key, value]) => ({
          name:  STATUS_CONFIG[key]?.label || key,
          value,
          color: STATUS_CONFIG[key]?.color || "#888",
        }))
    : [];

  // 10 lịch hẹn gần nhất từ allApts (sắp xếp theo createdAt hoặc appointmentDate)
  const recentApts = [...allApts]
    .sort((a, b) => new Date(b.createdAt || b.appointmentDate) - new Date(a.createdAt || a.appointmentDate))
    .slice(0, 10);

  return (
    <div style={{ padding: 24, background: "#f5f5f5", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>Tổng quan hệ thống</Title>
        <Text type="secondary">
          Cập nhật: {new Date().toLocaleString("vi-VN")}
        </Text>
      </div>

      {/* Stat Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Người dùng"
            value={counts.users}
            icon={<UserOutlined />}
            color="#378ADD"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Bác sĩ"
            value={counts.doctors}
            icon={<TeamOutlined />}
            color="#0F6E56"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Bệnh viện"
            value={counts.hospitals}
            icon={<MedicineBoxOutlined />}
            color="#534AB7"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Lịch hẹn hôm nay"
            value={todayApts.length || (allApts.length === 0 ? null : 0)}
            icon={<CalendarOutlined />}
            color="#854F0B"
            sub={todayPending > 0 ? `${todayPending} đang chờ xác nhận` : undefined}
          />
        </Col>
      </Row>

      {/* Charts + Tổng lịch hẹn */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {/* Pie chart */}
        <Col xs={24} lg={10}>
          <Card title="Lịch hẹn theo trạng thái" style={{ borderRadius: 12 }}>
            {loading ? (
              <div style={{ textAlign: "center", padding: 40 }}><Spin /></div>
            ) : pieData.length === 0 ? (
              <Text type="secondary">Chưa có dữ liệu</Text>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value.toLocaleString(), name]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>

        {/* Thống kê nhanh từng trạng thái */}
        <Col xs={24} lg={14}>
          <Card title="Chi tiết theo trạng thái" style={{ borderRadius: 12, height: "100%" }}>
            {loading || !aptStats ? (
              <div style={{ textAlign: "center", padding: 40 }}><Spin /></div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingTop: 8 }}>
                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
                  const count = aptStats[key] || 0;
                  const pct = totalApts > 0 ? Math.round((count / totalApts) * 100) : 0;
                  return (
                    <div key={key}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <Text style={{ fontSize: 13 }}>{cfg.label}</Text>
                        <Text strong style={{ fontSize: 13 }}>
                          {count.toLocaleString()} ({pct}%)
                        </Text>
                      </div>
                      <div style={{
                        height: 8, background: "#f0f0f0",
                        borderRadius: 4, overflow: "hidden"
                      }}>
                        <div style={{
                          width: `${pct}%`, height: "100%",
                          background: cfg.color, borderRadius: 4,
                          transition: "width 0.6s ease",
                        }} />
                      </div>
                    </div>
                  );
                })}
                <div style={{
                  marginTop: 8, paddingTop: 16,
                  borderTop: "1px solid #f0f0f0",
                  display: "flex", justifyContent: "space-between"
                }}>
                  <Text type="secondary">Tổng cộng</Text>
                  <Text strong>{totalApts?.toLocaleString()}</Text>
                </div>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Recent Appointments Table */}
      <Card title="Lịch hẹn gần đây" style={{ borderRadius: 12 }}>
        <Table
          columns={COLUMNS}
          dataSource={recentApts}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10, hideOnSinglePage: true, showSizeChanger: false }}
          size="middle"
          locale={{ emptyText: "Không có dữ liệu" }}
        />
      </Card>
    </div>
  );
};

export default Dashboard;