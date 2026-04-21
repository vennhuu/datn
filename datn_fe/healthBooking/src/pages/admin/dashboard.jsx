import {
  CalendarOutlined,
  MedicineBoxOutlined,
  TeamOutlined,
  TrophyOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Card, Col, Row, Spin, Table, Tag, Typography } from "antd";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
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
  { title: "Khung giờ", dataIndex: "timeSlot", key: "timeSlot" },
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
  {
    title: "Giá khám",
    dataIndex: "price",
    key: "price",
    render: (p) => p ? `${Number(p).toLocaleString("vi-VN")}đ` : "—",
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

// ── helpers ──────────────────────────────────────────────────────────────────

/** Top N bác sĩ được đặt nhiều nhất (tất cả status) */
const calcTopDoctors = (apts, n = 5) => {
  const map = {};
  apts.forEach(({ doctorName }) => {
    if (!doctorName) return;
    map[doctorName] = (map[doctorName] || 0) + 1;
  });
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([name, count], i) => ({ rank: i + 1, name, count }));
};

/** Doanh thu từng bệnh viện (chỉ tính lịch DONE có price) */
const calcHospitalRevenue = (apts) => {
  const map = {};
  apts.forEach(({ hospitalName, status, price }) => {
    if (status !== "DONE" || !price || !hospitalName) return;
    map[hospitalName] = (map[hospitalName] || 0) + Number(price);
  });
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .map(([name, revenue]) => ({ name, revenue }));
};

// ─────────────────────────────────────────────────────────────────────────────

const Dashboard = () => {
  const [loading, setLoading]   = useState(true);
  const [counts, setCounts]     = useState({ users: null, doctors: null, hospitals: null });
  const [aptStats, setAptStats] = useState(null);
  const [allApts, setAllApts]   = useState([]);

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

      if (statsR.status === "fulfilled")    setAptStats(statsR.value.data);
      if (allAptsR.status === "fulfilled")  setAllApts(allAptsR.value.data || []);

      setLoading(false);
    };
    fetchAll();
  }, []);

  // ── derived data ────────────────────────────────────────────────────────────
  const totalApts     = aptStats ? Object.values(aptStats).reduce((s, v) => s + v, 0) : null;
  const today         = new Date().toISOString().split("T")[0];
  const todayApts     = allApts.filter((a) => a.appointmentDate === today);
  const todayPending  = todayApts.filter((a) => a.status === "PENDING").length;

  const pieData = aptStats
    ? Object.entries(aptStats)
        .filter(([, v]) => v > 0)
        .map(([key, value]) => ({
          name:  STATUS_CONFIG[key]?.label || key,
          value,
          color: STATUS_CONFIG[key]?.color || "#888",
        }))
    : [];

  const recentApts     = [...allApts]
    .sort((a, b) => new Date(b.createdAt || b.appointmentDate) - new Date(a.createdAt || a.appointmentDate))
    .slice(0, 10);

  const topDoctors     = calcTopDoctors(allApts, 5);
  const hospitalRevenue = calcHospitalRevenue(allApts);

  const totalRevenue = hospitalRevenue.reduce((s, h) => s + h.revenue, 0);

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ padding: 24, background: "#f5f5f5", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>Tổng quan hệ thống</Title>
        <Text type="secondary">Cập nhật: {new Date().toLocaleString("vi-VN")}</Text>
      </div>

      {/* Stat Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {[
          { title: "Người dùng",        value: counts.users,     icon: <UserOutlined />,        color: "#378ADD" },
          { title: "Bác sĩ",            value: counts.doctors,   icon: <TeamOutlined />,        color: "#0F6E56" },
          { title: "Bệnh viện",         value: counts.hospitals, icon: <MedicineBoxOutlined />, color: "#534AB7" },
          {
            title: "Lịch hẹn hôm nay",
            value: allApts.length === 0 ? null : todayApts.length,
            icon: <CalendarOutlined />,
            color: "#854F0B",
            sub: todayPending > 0 ? `${todayPending} đang chờ xác nhận` : undefined,
          },
        ].map((card) => (
          <Col key={card.title} xs={24} sm={12} lg={6}>
            <StatCard {...card} />
          </Col>
        ))}
      </Row>

      {/* Pie + Status bars */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={10}>
          <Card title="Lịch hẹn theo trạng thái" style={{ borderRadius: 12 }}>
            {loading ? (
              <div style={{ textAlign: "center", padding: 40 }}><Spin /></div>
            ) : pieData.length === 0 ? (
              <Text type="secondary">Chưa có dữ liệu</Text>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={65} outerRadius={95} paddingAngle={3} dataKey="value">
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v, n) => [v.toLocaleString(), n]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={14}>
          <Card title="Chi tiết theo trạng thái" style={{ borderRadius: 12, height: "100%" }}>
            {loading || !aptStats ? (
              <div style={{ textAlign: "center", padding: 40 }}><Spin /></div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingTop: 8 }}>
                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
                  const count = aptStats[key] || 0;
                  const pct   = totalApts > 0 ? Math.round((count / totalApts) * 100) : 0;
                  return (
                    <div key={key}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <Text style={{ fontSize: 13 }}>{cfg.label}</Text>
                        <Text strong style={{ fontSize: 13 }}>{count.toLocaleString()} ({pct}%)</Text>
                      </div>
                      <div style={{ height: 8, background: "#f0f0f0", borderRadius: 4, overflow: "hidden" }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: cfg.color, borderRadius: 4, transition: "width 0.6s ease" }} />
                      </div>
                    </div>
                  );
                })}
                <div style={{ marginTop: 8, paddingTop: 16, borderTop: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between" }}>
                  <Text type="secondary">Tổng cộng</Text>
                  <Text strong>{totalApts?.toLocaleString()}</Text>
                </div>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Top Doctors + Hospital Revenue */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>

        {/* Top 5 bác sĩ được đặt nhiều nhất */}
        <Col xs={24} lg={10}>
          <Card
            title={
              <span>
                <TrophyOutlined style={{ color: "#EF9F27", marginRight: 8 }} />
                Top 5 bác sĩ được đặt nhiều nhất
              </span>
            }
            style={{ borderRadius: 12, height: "100%" }}
          >
            {loading ? (
              <div style={{ textAlign: "center", padding: 40 }}><Spin /></div>
            ) : topDoctors.length === 0 ? (
              <Text type="secondary">Chưa có dữ liệu</Text>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {topDoctors.map(({ rank, name, count }) => {
                  const medalColors = ["#FFD700", "#C0C0C0", "#CD7F32"];
                  const isMedal = rank <= 3;
                  return (
                    <div key={name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <Avatar
                        size={32}
                        style={{
                          background: isMedal ? medalColors[rank - 1] : "#e8e8e8",
                          color: isMedal ? "#fff" : "#888",
                          fontWeight: 700,
                          fontSize: 13,
                          flexShrink: 0,
                        }}
                      >
                        {rank}
                      </Avatar>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {name}
                        </div>
                        <div style={{ height: 6, background: "#f0f0f0", borderRadius: 3, marginTop: 4, overflow: "hidden" }}>
                          <div style={{
                            width: `${Math.round((count / (topDoctors[0]?.count || 1)) * 100)}%`,
                            height: "100%",
                            background: isMedal ? medalColors[rank - 1] : "#378ADD",
                            borderRadius: 3,
                            transition: "width 0.6s ease",
                          }} />
                        </div>
                      </div>
                      <Text strong style={{ fontSize: 14, color: "#378ADD", flexShrink: 0 }}>
                        {count} lịch
                      </Text>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </Col>

        {/* Doanh thu theo bệnh viện */}
        <Col xs={24} lg={14}>
          <Card
            title="Doanh thu theo bệnh viện (lịch DONE)"
            extra={
              <Text strong style={{ color: "#0F6E56" }}>
                Tổng: {totalRevenue.toLocaleString("vi-VN")}đ
              </Text>
            }
            style={{ borderRadius: 12 }}
          >
            {loading ? (
              <div style={{ textAlign: "center", padding: 40 }}><Spin /></div>
            ) : hospitalRevenue.length === 0 ? (
              <Text type="secondary">Chưa có doanh thu</Text>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={hospitalRevenue} margin={{ top: 4, right: 16, left: 16, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                    angle={-20}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis
                    tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}tr`}
                    tick={{ fontSize: 11 }}
                    width={44}
                  />
                  <Tooltip
                    formatter={(v) => [`${Number(v).toLocaleString("vi-VN")}đ`, "Doanh thu"]}
                  />
                  <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                    {hospitalRevenue.map((_, i) => (
                      <Cell key={i} fill={["#378ADD", "#0F6E56", "#534AB7", "#EF9F27", "#E24B4A"][i % 5]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
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