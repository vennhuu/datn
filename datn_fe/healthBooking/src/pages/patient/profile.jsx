import { useState, useEffect } from "react";
import { Avatar, message, Upload, Modal, Form, Input, Select, DatePicker } from "antd";
import {
  UserOutlined,
  EditOutlined,
  CameraOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  ManOutlined,
  WomanOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { updateUploadUserAvatarAPI, updateUserAPI, updateUserAvatarAPI } from "../../services/api.service.user";

const { Option } = Select;

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      setPreviewAvatar(
        parsed.avatar
          ? `${import.meta.env.VITE_BACKEND_URL}/storage/avt_patient/${parsed.avatar}`
          : null
      );
    }
  }, []);

  const handleEditClick = () => {
    form.setFieldsValue({
      name: user?.name,
      email: user?.email,
      mobile: user?.mobile,
      gender: user?.gender,
      birthday: user?.birthday ? dayjs(user.birthday, "DD/MM/YYYY") : null,
      address: user?.address,
      about: user?.about,
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.resetFields();
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const birthdayStr = values.birthday
        ? values.birthday.format("DD/MM/YYYY")
        : user?.birthday;

      const res = await updateUserAPI(
        user.id,
        values.name,
        values.email,
        undefined,
        values.gender,
        birthdayStr,
        values.address,
        values.mobile,
        values.about
      );

      // Axios interceptor trả về error.response.data thay vì throw,
      // nên cần kiểm tra statusCode hoặc error từ response
      if (res?.statusCode && res.statusCode !== 200) {
        // Backend trả lỗi — lấy message từ res.message hoặc res.error
        const errMsg =
          res?.message ||
          res?.error ||
          "Cập nhật thất bại, vui lòng thử lại.";
        message.error(errMsg);
        return;
      }

      if (res?.data) {
        const updated = {
          ...user,
          ...values,
          birthday: birthdayStr,
        };
        localStorage.setItem("user", JSON.stringify(updated));
        setUser(updated);
        setIsEditing(false);
        message.success("Cập nhật thông tin thành công!");
      } else {
        // Fallback nếu backend không trả statusCode rõ ràng
        const errMsg = res?.message || res?.error || "Cập nhật thất bại, vui lòng thử lại.";
        message.error(errMsg);
      }
    } catch (err) {
      if (err?.errorFields) return; // lỗi validate form, không cần báo
      message.error(err?.message || "Đã xảy ra lỗi không xác định!");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) { message.error("Chỉ hỗ trợ file ảnh!"); return false; }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) { message.error("Ảnh phải nhỏ hơn 2MB!"); return false; }

    try {
      setAvatarLoading(true);
      // Step 1: upload file
      const uploadRes = await updateUserAvatarAPI(file, "avt_patient");
      const fileName = uploadRes?.data?.fileName;
      if (!fileName) throw new Error("Upload failed");

      // Step 2: update user avatar in DB
      await updateUploadUserAvatarAPI(user.id, fileName);

      // Step 3: update local state
      const updated = { ...user, avatar: fileName };
      localStorage.setItem("user", JSON.stringify(updated));
      setUser(updated);
      setPreviewAvatar(
        `${import.meta.env.VITE_BACKEND_URL}/storage/avt_patient/${fileName}`
      );
      message.success("Cập nhật ảnh đại diện thành công!");
    } catch {
      message.error("Tải ảnh thất bại, vui lòng thử lại!");
    } finally {
      setAvatarLoading(false);
    }
    return false; // prevent auto-upload
  };

  if (!user) {
    return (
      <div style={styles.loadingWrap}>
        <div style={styles.skeletonCard} />
      </div>
    );
  }

  const infoItems = [
    { icon: <MailOutlined />, label: "Email", value: user.email, color: "#0a6abf" },
    { icon: <PhoneOutlined />, label: "Số điện thoại", value: user.mobile || "Chưa cập nhật", color: "#0e9a57" },
    {
      icon: user.gender === "Nữ" ? <WomanOutlined /> : <ManOutlined />,
      label: "Giới tính",
      value: user.gender || "Chưa cập nhật",
      color: "#f5a623",
    },
    { icon: <CalendarOutlined />, label: "Ngày sinh", value: user.birthday || "Chưa cập nhật", color: "#9b51e0" },
    { icon: <EnvironmentOutlined />, label: "Địa chỉ", value: user.address || "Chưa cập nhật", color: "#e53935", span: 2 },
  ];

  return (
    <div style={styles.page}>
      {/* ── HEADER CARD ── */}
      <div style={styles.headerCard}>
        {/* Background pattern */}
        <div style={styles.headerBg} />

        <div style={styles.headerContent}>
          {/* Avatar with upload */}
          <div style={styles.avatarWrap}>
            <Avatar
              size={110}
              src={previewAvatar}
              icon={<UserOutlined />}
              style={styles.avatar}
            />
            <Upload
              showUploadList={false}
              beforeUpload={handleAvatarUpload}
              accept="image/*"
            >
              <button style={styles.cameraBtn} title="Đổi ảnh đại diện">
                {avatarLoading ? "..." : <CameraOutlined />}
              </button>
            </Upload>
          </div>

          {/* Name + role */}
          <div style={styles.headerInfo}>
            <h1 style={styles.userName}>{user.name}</h1>
            <div style={styles.roleBadge}>Bệnh nhân</div>
            {user.about && <p style={styles.about}>{user.about}</p>}
          </div>

          {/* Edit button */}
          {!isEditing && (
            <button style={styles.editBtn} onClick={handleEditClick}>
              <EditOutlined style={{ marginRight: 6 }} />
              Chỉnh sửa
            </button>
          )}
        </div>
      </div>

      {/* ── INFO GRID ── */}
      {!isEditing ? (
        <div style={styles.infoCard}>
          <div style={styles.infoCardHeader}>
            <h2 style={styles.infoCardTitle}>Thông tin cá nhân</h2>
          </div>
          <div style={styles.infoGrid}>
            {infoItems.map((item, i) => (
              <div
                key={i}
                style={{
                  ...styles.infoItem,
                  ...(item.span === 2 ? styles.infoItemFull : {}),
                }}
              >
                <div style={{ ...styles.infoIcon, color: item.color, background: item.color + "18" }}>
                  {item.icon}
                </div>
                <div>
                  <div style={styles.infoLabel}>{item.label}</div>
                  <div style={styles.infoValue}>{item.value}</div>
                </div>
              </div>
            ))}

            {/* About - full width */}
            <div style={{ ...styles.infoItem, ...styles.infoItemFull }}>
              <div style={{ ...styles.infoIcon, color: "#0a6abf", background: "#eef4ff" }}>
                📝
              </div>
              <div>
                <div style={styles.infoLabel}>Giới thiệu</div>
                <div style={styles.infoValue}>{user.about || "Chưa cập nhật"}</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── EDIT FORM ── */
        <div style={styles.infoCard}>
          <div style={styles.infoCardHeader}>
            <h2 style={styles.infoCardTitle}>Chỉnh sửa thông tin</h2>
            <div style={styles.formActions}>
              <button style={styles.cancelBtn} onClick={handleCancel}>
                <CloseOutlined style={{ marginRight: 6 }} />
                Huỷ
              </button>
              <button
                style={{ ...styles.saveBtn, opacity: loading ? 0.7 : 1 }}
                onClick={handleSave}
                disabled={loading}
              >
                <SaveOutlined style={{ marginRight: 6 }} />
                {loading ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </div>

          <Form form={form} layout="vertical" style={styles.form}>
            <div style={styles.formGrid}>
              <Form.Item
                label="Họ và tên"
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
                style={styles.formItem}
              >
                <Input prefix={<UserOutlined style={{ color: "#94a3b8" }} />} placeholder="Nhập họ và tên" style={styles.input} />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, type: "email", message: "Email không hợp lệ!" }]}
                style={styles.formItem}
              >
                <Input prefix={<MailOutlined style={{ color: "#94a3b8" }} />} placeholder="Nhập email" style={styles.input} />
              </Form.Item>

              <Form.Item label="Số điện thoại" name="mobile" style={styles.formItem}>
                <Input prefix={<PhoneOutlined style={{ color: "#94a3b8" }} />} placeholder="Nhập số điện thoại" style={styles.input} />
              </Form.Item>

              <Form.Item label="Giới tính" name="gender" style={styles.formItem}>
                <Select placeholder="Chọn giới tính" style={styles.input}>
                  <Option value="NAM">Nam</Option>
                  <Option value="NU">Nữ</Option>
                  <Option value="KHAC">Khác</Option>
                </Select>
              </Form.Item>

              <Form.Item label="Ngày sinh" name="birthday" style={styles.formItem}>
                <DatePicker
                  format="DD/MM/YYYY"
                  placeholder="Chọn ngày sinh"
                  style={{ ...styles.input, width: "100%" }}
                />
              </Form.Item>

              <Form.Item label="Địa chỉ" name="address" style={styles.formItem}>
                <Input prefix={<EnvironmentOutlined style={{ color: "#94a3b8" }} />} placeholder="Nhập địa chỉ" style={styles.input} />
              </Form.Item>

              <Form.Item label="Giới thiệu" name="about" style={{ ...styles.formItem, ...styles.formItemFull }}>
                <Input.TextArea
                  placeholder="Mô tả ngắn về bản thân..."
                  rows={3}
                  style={{ ...styles.input, resize: "none" }}
                />
              </Form.Item>
            </div>
          </Form>
        </div>
      )}
    </div>
  );
};

const styles = {
  page: {
    maxWidth: 860,
    margin: "40px auto",
    padding: "0 24px 60px",
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  loadingWrap: {
    maxWidth: 860,
    margin: "40px auto",
    padding: "0 24px",
  },
  skeletonCard: {
    height: 200,
    background: "#e8edf3",
    borderRadius: 16,
    animation: "pulse 1.5s infinite",
  },

  /* Header card */
  headerCard: {
    background: "#fff",
    borderRadius: 16,
    border: "1px solid #e8edf3",
    overflow: "hidden",
    position: "relative",
  },
  headerBg: {
    height: 100,
    background: "linear-gradient(135deg, #0a3d6b 0%, #0a6abf 60%, #1a9fe0 100%)",
  },
  headerContent: {
    display: "flex",
    alignItems: "flex-end",
    gap: 20,
    padding: "0 28px 24px",
    marginTop: -50,
    position: "relative",
  },
  avatarWrap: {
    position: "relative",
    flexShrink: 0,
  },
  avatar: {
    border: "4px solid #fff",
    boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
    background: "#0a6abf",
    fontSize: 40,
  },
  cameraBtn: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 28,
    height: 28,
    background: "#0a6abf",
    color: "#fff",
    border: "2px solid #fff",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    cursor: "pointer",
    padding: 0,
  },
  headerInfo: {
    flex: 1,
    paddingBottom: 4,
    paddingTop: 52,
  },
  userName: {
    fontSize: 22,
    fontWeight: 700,
    color: "#1e2d3d",
    margin: "0 0 6px",
    letterSpacing: "-0.3px",
  },
  roleBadge: {
    display: "inline-block",
    background: "#eef4ff",
    color: "#0a6abf",
    fontSize: 12,
    fontWeight: 600,
    padding: "3px 10px",
    borderRadius: 6,
    marginBottom: 6,
  },
  about: {
    fontSize: 13,
    color: "#8898aa",
    margin: 0,
  },
  editBtn: {
    background: "#0a6abf",
    color: "#fff",
    border: "none",
    borderRadius: 9,
    padding: "9px 20px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    alignSelf: "flex-end",
    marginBottom: 4,
    flexShrink: 0,
  },

  /* Info card */
  infoCard: {
    background: "#fff",
    borderRadius: 16,
    border: "1px solid #e8edf3",
    padding: "24px 28px",
  },
  infoCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottom: "1px solid #f0f4f8",
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#1e2d3d",
    margin: 0,
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
  },
  infoItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    background: "#f8fafc",
    borderRadius: 12,
    padding: "14px 16px",
    border: "1px solid #f0f4f8",
  },
  infoItemFull: {
    gridColumn: "1 / -1",
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 9,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 15,
    flexShrink: 0,
  },
  infoLabel: {
    fontSize: 11,
    color: "#8898aa",
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 500,
    color: "#1e2d3d",
  },

  /* Edit form */
  formActions: {
    display: "flex",
    gap: 10,
  },
  cancelBtn: {
    background: "#fff",
    color: "#64748b",
    border: "1px solid #e8edf3",
    borderRadius: 9,
    padding: "8px 18px",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
  saveBtn: {
    background: "#0a6abf",
    color: "#fff",
    border: "none",
    borderRadius: 9,
    padding: "8px 20px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    transition: "opacity .15s",
  },
  form: {
    width: "100%",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0 20px",
  },
  formItem: {
    marginBottom: 18,
  },
  formItemFull: {
    gridColumn: "1 / -1",
  },
  input: {
    borderRadius: 9,
    height: 40,
    fontSize: 14,
    border: "1px solid #e8edf3",
  },
};

export default Profile;