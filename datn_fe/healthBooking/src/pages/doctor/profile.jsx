import { useEffect, useState, useRef } from "react";
import { Form, Input, InputNumber, Select, message, Spin } from "antd";
import { EditOutlined, CameraOutlined, SaveOutlined, UserOutlined } from "@ant-design/icons";
import { getDoctorProfileAPI, updateDoctorProfileAPI, uploadDoctorAvatarAPI } from "../../services/api.service.doctor";

const { Option } = Select;

const ProfileDoctor = () => {
  const [profile, setProfile]           = useState(null);
  const [loading, setLoading]           = useState(true);
  const [saving, setSaving]             = useState(false);
  const [uploadingAvt, setUploadingAvt] = useState(false);
  const [avatarUrl, setAvatarUrl]       = useState(null);
  const fileInputRef = useRef(null);
  const [form] = Form.useForm();

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const res  = await getDoctorProfileAPI();
      const data = res?.data || res;
      if (data) {
        setProfile(data);
        form.setFieldsValue({
          name:            data.name            || "",
          mobile:          data.mobile          || "",
          address:         data.address         || "",
          about:           data.about           || "",
          specialization:  data.specialization  || "",
          degree:          data.degree          || "",
          experienceYears: data.experienceYears || "",
          price:           data.price           || "",
          bio:             data.bio             || "",
        });
        if (data.avatar) {
          setAvatarUrl(
            `${import.meta.env.VITE_BACKEND_URL}/storage/avt_doctor/${data.avatar}`
          );
        }
      }
    } catch {
      message.error("Không thể tải thông tin hồ sơ");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      await updateDoctorProfileAPI({
        name:            values.name,
        mobile:          values.mobile,
        address:         values.address,
        about:           values.about,
        specialization:  values.specialization,
        degree:          values.degree,
        experienceYears: values.experienceYears,
        bio:             values.bio,
        price:           values.price,
        email:           profile.email,
        gender:          profile.gender,
        hospital:        profile.hospital,
      });

      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...stored, name: values.name }));
      message.success("Cập nhật hồ sơ thành công!");
    } catch (err) {
      if (err?.errorFields) return;
      message.error("Cập nhật thất bại, thử lại sau!");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { message.error("Vui lòng chọn file ảnh!"); return; }
    if (file.size > 5 * 1024 * 1024)    { message.error("Ảnh không được quá 5MB!"); return; }

    const reader = new FileReader();
    reader.onload = (ev) => setAvatarUrl(ev.target.result);
    reader.readAsDataURL(file);

    setUploadingAvt(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await uploadDoctorAvatarAPI(formData);
      const newAvatar = res?.data?.avatar || res?.avatar;
      if (newAvatar) {
        setAvatarUrl(`${import.meta.env.VITE_BACKEND_URL}/storage/avt_doctor/${newAvatar}`);
        const stored = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem("user", JSON.stringify({ ...stored, avatar: newAvatar }));
      }
      message.success("Cập nhật ảnh đại diện thành công!");
    } catch {
      message.error("Upload ảnh thất bại!");
      if (profile?.avatar) {
        setAvatarUrl(`${import.meta.env.VITE_BACKEND_URL}/storage/avt_doctor/${profile.avatar}`);
      } else {
        setAvatarUrl(null);
      }
    } finally {
      setUploadingAvt(false);
      e.target.value = "";
    }
  };

  if (loading) return <Spin fullscreen />;

  const initials = (profile?.name || "BS").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div style={s.page}>
      <div style={s.pageHeader}>
        <h2 style={s.pageTitle}>Hồ sơ cá nhân</h2>
        <p style={s.pageSub}>Cập nhật thông tin và hình ảnh của bạn</p>
      </div>

      <div style={s.layout}>

        {/* ── Left: Avatar Card ── */}
        <div style={s.leftCol}>
          <div style={s.avatarCard}>
            <div style={s.avatarWrap}>
              {avatarUrl
                ? <img src={avatarUrl} alt="avatar" style={s.avatarImg} />
                : <div style={s.avatarFallback}>{initials}</div>
              }
              {uploadingAvt && (
                <div style={s.avatarOverlay}><Spin size="small" /></div>
              )}
              <button style={s.avatarEditBtn} onClick={() => fileInputRef.current?.click()} disabled={uploadingAvt}>
                <CameraOutlined style={{ fontSize: 14 }} />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatarChange} />
            </div>

            <div style={s.avatarName}>{profile?.name || "Bác sĩ"}</div>
            <div style={s.avatarSpec}>{profile?.specialization || "Chuyên khoa"}</div>

            <div style={s.divider} />

            <div style={s.infoList}>
              <InfoRow icon="📧" label="Email"       value={profile?.email || "—"} />
              <InfoRow icon="📞" label="Điện thoại"  value={profile?.mobile || "—"} />
              <InfoRow icon="🎓" label="Học vị"      value={profile?.degree || "—"} />
              <InfoRow icon="🏥" label="Kinh nghiệm" value={profile?.experienceYears ? `${profile.experienceYears} năm` : "—"} />
              <InfoRow icon="💰" label="Giá khám"    value={profile?.price ? `${Number(profile.price).toLocaleString("vi-VN")}đ` : "—"} />
              <InfoRow icon="📍" label="Địa chỉ"     value={profile?.address || "—"} />
            </div>
          </div>
        </div>

        {/* ── Right: Edit Form ── */}
        <div style={s.rightCol}>
          <div style={s.formCard}>
            <div style={s.formCardHead}>
              <EditOutlined style={{ color: "#0a6abf", marginRight: 8 }} />
              <span style={s.formCardTitle}>Chỉnh sửa thông tin</span>
            </div>

            <Form form={form} layout="vertical" style={{ padding: "20px 24px" }}>

              {/* Thông tin cá nhân */}
              <div style={s.section}>
                <div style={s.sectionTitle}>Thông tin cá nhân</div>
                <div style={s.formGrid}>
                  <Form.Item label="Họ và tên" name="name" rules={[{ required: true, message: "Vui lòng nhập tên" }]}>
                    <Input prefix={<UserOutlined style={{ color: "#94a3b8" }} />} placeholder="Nguyễn Văn A" />
                  </Form.Item>
                  <Form.Item label="Số điện thoại" name="mobile">
                    <Input prefix={<span style={{ color: "#94a3b8" }}>📞</span>} placeholder="0123456789" />
                  </Form.Item>
                </div>
                <Form.Item label="Địa chỉ" name="address">
                  <Input prefix={<span style={{ color: "#94a3b8" }}>📍</span>} placeholder="Địa chỉ..." />
                </Form.Item>
                <Form.Item label="Giới thiệu bản thân" name="about">
                  <Input.TextArea rows={2} placeholder="Vài dòng về bạn..." showCount maxLength={200} />
                </Form.Item>
              </div>

              {/* Thông tin chuyên môn */}
              <div style={s.section}>
                <div style={s.sectionTitle}>Thông tin chuyên môn</div>
                <div style={s.formGrid}>
                  <Form.Item label="Chuyên khoa" name="specialization">
                    <Input placeholder="VD: Nội tổng quát, Tim mạch..." />
                  </Form.Item>
                  <Form.Item label="Học vị" name="degree">
                    <Input placeholder="VD: Thạc sĩ, Tiến sĩ, Bác sĩ CKI..." />
                  </Form.Item>
                </div>
                <div style={s.formGrid}>
                  <Form.Item label="Số năm kinh nghiệm" name="experienceYears">
                    <InputNumber min={0} max={60} placeholder="5" style={{ width: "100%" }} addonAfter="năm" />
                  </Form.Item>
                  <Form.Item label="Giá khám (VNĐ)" name="price">
                    <InputNumber
                      min={0} placeholder="200000" style={{ width: "100%" }}
                      formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      parser={v => v.replace(/,/g, "")}
                      addonAfter="đ"
                    />
                  </Form.Item>
                </div>
              </div>

              {/* Giới thiệu chuyên môn */}
              <div style={s.section}>
                <div style={s.sectionTitle}>Giới thiệu chuyên môn</div>
                <Form.Item name="bio">
                  <Input.TextArea rows={4} placeholder="Mô tả chuyên môn, kinh nghiệm điều trị..." showCount maxLength={500} />
                </Form.Item>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button style={{ ...s.btnSave, opacity: saving ? 0.7 : 1 }} type="button" onClick={handleSave} disabled={saving}>
                  <SaveOutlined style={{ fontSize: 14 }} />
                  {saving ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
    <span style={{ fontSize: 13, color: "#94a3b8", display: "flex", alignItems: "center", gap: 6 }}>
      <span>{icon}</span> {label}
    </span>
    <span style={{ fontSize: 13, color: "#0f172a", fontWeight: 500, textAlign: "right", maxWidth: "55%" }}>
      {value}
    </span>
  </div>
);

const s = {
  page:       { padding: "32px 36px", background: "#f0f4f8", minHeight: "100vh" },
  pageHeader: { marginBottom: 24 },
  pageTitle:  { fontSize: 24, fontWeight: 700, color: "#0f172a", margin: 0 },
  pageSub:    { fontSize: 13, color: "#94a3b8", margin: "4px 0 0" },
  layout:     { display: "grid", gridTemplateColumns: "280px 1fr", gap: 24, alignItems: "start" },
  leftCol:    {},
  rightCol:   {},
  avatarCard: { background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.05)", padding: "28px 20px 20px", textAlign: "center" },
  avatarWrap: { position: "relative", width: 96, height: 96, margin: "0 auto 16px" },
  avatarImg:  { width: 96, height: 96, borderRadius: "50%", objectFit: "cover", border: "3px solid #eef4ff" },
  avatarFallback: { width: 96, height: 96, borderRadius: "50%", background: "linear-gradient(135deg, #0a6abf, #1d4ed8)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 28, fontWeight: 700, border: "3px solid #eef4ff" },
  avatarOverlay:  { position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(255,255,255,0.75)", display: "flex", alignItems: "center", justifyContent: "center" },
  avatarEditBtn:  { position: "absolute", bottom: 2, right: 2, width: 28, height: 28, borderRadius: "50%", background: "#0a6abf", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", cursor: "pointer" },
  avatarName: { fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 4 },
  avatarSpec: { fontSize: 13, color: "#94a3b8", marginBottom: 16 },
  divider:    { height: 1, background: "#f1f5f9", margin: "16px 0" },
  infoList:   { textAlign: "left" },
  formCard:       { background: "#fff", borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.05)", overflow: "hidden" },
  formCardHead:   { padding: "18px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center" },
  formCardTitle:  { fontSize: 16, fontWeight: 700, color: "#0f172a" },
  section:        { marginBottom: 24 },
  sectionTitle:   { fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 14, paddingBottom: 8, borderBottom: "1px solid #f8fafc" },
  formGrid:       { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  btnSave:        { display: "flex", alignItems: "center", gap: 8, padding: "10px 24px", borderRadius: 10, border: "none", background: "#0a6abf", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" },
};

export default ProfileDoctor;