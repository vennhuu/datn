import { Button, DatePicker, Form, Input, Modal, notification, Select, Upload } from "antd";
import { useState } from "react";
import { createUserAPI, updateUserAvatarAPI } from "../../../services/api.service.user";
import { PlusOutlined } from "@ant-design/icons";

const UserForm = (props) => {
    const {loadUser} = props;

    const [isModalOpen , setIsModalOpen] = useState(false) ;
    const [name , setName] = useState("") ;
    const [email , setEmail] = useState("") ;
    const [gender , setGender] = useState("") ;
    const [birthday , setBirthday] = useState(null) ;
    const [address , setAddress] = useState("") ;
    const [mobile , setMobile] = useState("") ;
    const [about , setAbout] = useState("") ;
    const [password , setPassword] = useState("") ;

    const [selectedFile, setSelectedFile] = useState(null)
    const [preview , setPreview] = useState(null)

    const handleOk = async() => {

        let avatar = "";

        // 1. upload ảnh trước
        if (selectedFile) {
            const uploadRes = await updateUserAvatarAPI(selectedFile, "avt_patient");

            if (uploadRes.data) {
                avatar = uploadRes.data.fileName;
            } else {
                notification.error({
                    message: "Upload avatar thất bại"
                });
                return;
            }
        }

        const birthdayStr = birthday ? birthday.format("YYYY-MM-DD") : "";
        const res = await createUserAPI(name , email, password, gender , birthdayStr , address , mobile , about , avatar) ;
        if ( res.data ) {
            notification.success({
                title: "Tạo mới bệnh nhân",
                description: "Tạo bệnh nhân mới thành công"
            })
            resetAndCloseModal()
            await loadUser() ;
        }
        else {
            notification.error({
                title : "Tạo mới bệnh nhân thất bại" ,
                description: JSON.stringify(res.message)
            })
        }
    }
    const handleCancel = () => {
        setIsModalOpen(false);
    }

    const resetAndCloseModal = () => {
        setIsModalOpen(false)
        setName("")
        setEmail("")
        setPassword("")
        setMobile("")
        setGender("")
        setBirthday(null)
        setAddress("")
        setAbout("")
    }
    return (
        <>
            <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                marginTop: "20px" ,
                marginBottom: "20px"
            }}>
                <h3>Danh sách bệnh nhân</h3>
                <Button type="primary" onClick={() => setIsModalOpen(true)}>Thêm bệnh nhân</Button>
            </div>
            <Modal
                title="Thêm bệnh nhân"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={"Tạo"}
                cancelText={"Hủy"}
                width={600}
            >
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 20px", padding: "12px 0" }}>
                    
                    <div>
                        <span>Họ và tên</span>
                        <Input value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div>
                        <span>Email</span>
                        <Input value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <div>
                        <span>Số điện thoại</span>
                        <Input value={mobile} onChange={(e) => setMobile(e.target.value)} />
                    </div>
                    <div>
                        <span>Mật khẩu</span>
                        <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                        <span>Địa chỉ</span>
                        <Input value={address} onChange={(e) => setAddress(e.target.value)} />
                    </div>
                    <div>
                        <span>Giới tính</span>
                        <Select
                            style={{ width: "100%" }}
                            value={gender || undefined}
                            onChange={(value) => setGender(value)}
                            placeholder="Chọn giới tính"
                            options={[
                                { label: 'Nam', value: 'NAM' },
                                { label: 'Nữ', value: 'NU' },
                                { label: 'Khác', value: 'KHAC' }
                            ]}
                        />
                    </div>
                    <div>
                        <span>Ngày sinh</span>
                        <DatePicker
                            style={{ width: "100%" }}
                            value={birthday}
                            onChange={(date) => setBirthday(date)}
                            format="DD/MM/YYYY"
                            placeholder="Chọn ngày sinh"
                            placement="topRight"
                            popupStyle={{ zIndex: 2000 }}
                            getPopupContainer={() => document.body}
                        />
                    </div>

                    <div style={{ gridColumn: "1 / -1" }}>
                        <span>Về tôi</span>
                        <Input value={about} onChange={(e) => setAbout(e.target.value)} />
                    </div>

                    <div>
                        <span>Ảnh đại diện</span>
                        <Upload listType="picture-card"
                            beforeUpload={(file) => {
                                setSelectedFile(file); // lưu file vào state
                                setPreview(URL.createObjectURL(file)); // preview ảnh
                                return false;
                            }}
                            maxCount={1}>
                            <button
                                style={{ color: 'inherit', cursor: 'inherit', border: 0, background: 'none' }}
                                type="button"
                                >
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Tải ảnh</div>
                            </button>
                        </Upload>
                    </div>
                </div>
            </Modal>
        </>
    );
}
export default UserForm;