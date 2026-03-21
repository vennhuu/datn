import { Button, DatePicker, Form, Input, Modal, notification, Select } from "antd";
import { useState } from "react";
import { createNewDoctorAPI } from "../../../services/api.service.doctor";

const DoctorForm = (props) => {
    const {loadDoctor} = props;

    const [isModalOpen , setIsModalOpen] = useState(false) ;
    const [name , setName] = useState("") ;
    const [email , setEmail] = useState("") ;
    const [gender , setGender] = useState("") ;
    const [birthday , setBirthday] = useState(null) ;
    const [address , setAddress] = useState("") ;
    const [mobile , setMobile] = useState("") ;
    const [about , setAbout] = useState("") ;
    const [password , setPassword] = useState("") ;

    const [specialization , setSpecialization] = useState("") ;
    const [degree , setDegree] = useState("") ;
    const [hospital , setHospital] = useState("") ;
    const [experienceYears , setExperienceYears] = useState("") ;
    const [bio , setBio] = useState("") ;

    const handleOk = async() => {
        const birthdayStr = birthday ? birthday.format("YYYY-MM-DD") : "";
        const res = await createNewDoctorAPI(name , email, password, gender , birthdayStr , address , mobile , about ,
        specialization , degree , hospital , experienceYears , bio) ;
        if ( res.data ) {
            notification.success({
                title: "Tạo mới bác sĩ",
                description: "Tạo bác sĩ mới thành công"
            })
            resetAndCloseModal()
            await loadDoctor() ;
        }
        else {
            notification.error({
                title : "Tạo mới bác sĩ thất bại" ,
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
        setSpecialization("")
        setDegree("")
        setHospital("")
        setExperienceYears("")
        setBio("")
    }
    return (
        <>
            <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                marginTop: "20px" ,
                marginBottom: "20px"
            }}>
                <h3>Danh sách bác sĩ</h3>
                <Button type="primary" onClick={() => setIsModalOpen(true)}>Thêm bác sĩ</Button>
            </div>
            <Modal
                title="Thêm bác sĩ"
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

                    {/* in4 doctor */}
                    <div>
                        <span>Chuyên khoa</span>
                        <Select
                            style={{ width: "100%" }}
                            value={specialization || undefined}
                            onChange={(value) => setSpecialization(value)}
                            placeholder="Chọn chuyên khoa"
                            options={[
                                { label: 'Nội tổng quát', value: 'NOI_TONG_QUAT' },
                                { label: 'Ngoại khoa', value: 'NGOAI_KHOA' },
                                { label: 'Sản phụ khoa', value: 'SAN_PHU_KHOA' },
                                { label: 'Nhi khoa', value: 'NHI_KHOA' },
                                { label: 'Tim mạch', value: 'TIM_MACH' },
                                { label: 'Da liễu', value: 'DA_LIEU' },
                                { label: 'Tai - Mũi - Họng', value: 'TAI_MUI_HONG' },
                                { label: 'Mắt', value: 'MAT' },
                                { label: 'Thần kinh', value: 'THAN_KINH' },
                                { label: 'Cơ xương khớp', value: 'CO_XUONG_KHOP' },
                                { label: 'Tiêu hóa', value: 'TIEU_HOA' },
                                { label: 'Nội tiết', value: 'NOI_TIET' },
                                { label: 'Hô hấp', value: 'HO_HAP' },
                                { label: 'Tâm lý - Tâm thần', value: 'TAM_LY' }
                            ]}
                        />
                    </div>
                    <div>
                        <span>Học vị</span>
                        <Select
                            style={{ width: "100%" }}
                            value={degree || undefined}
                            onChange={(value) => setDegree(value)}
                            placeholder="Chọn học vị"
                            options={[
                                { label: 'Bác sĩ', value: 'BS' },
                                { label: 'Thạc sĩ', value: 'THS' },
                                { label: 'Tiến sĩ', value: 'TS' },
                                { label: 'BS Chuyên khoa I', value: 'BSCK1' },
                                { label: 'BS Chuyên khoa II', value: 'BSCK2' }
                            ]}
                        />
                    </div>
                    <div>
                        <span>Bệnh viện</span>
                        <Input value={hospital} onChange={(e) => setHospital(e.target.value)} />
                    </div>

                    <div>
                        <span>Số năm kinh nghiệm</span>
                        <Input value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} />
                    </div>

                    <div style={{ gridColumn: "1 / -1" }}>
                        <span>Giới thiệu ngắn gọn</span>
                        <Input value={bio} onChange={(e) => setBio(e.target.value)} />
                    </div>

                </div>
            </Modal>
        </>
    );
}
export default DoctorForm;