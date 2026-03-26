import { useEffect, useState } from "react";
import { DatePicker, Input, Modal, notification, Select } from "antd";
import dayjs from "dayjs";
import { updateDoctorAPI } from "../../../services/api.service.doctor";

const UpdateDoctorModal = (props) => {

    const {isModalUpdateOpen , setIsModalUpdateOpen , dataUpdate , setDataUpdate , loadDoctor} = props ;

    const [id , setId] = useState("") ;
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
    const [experienceYears ,setExperienceYears] = useState("") ;
    const [bio , setBio] = useState("") ;


    useEffect(() => {
        if(dataUpdate) {
            setId(dataUpdate.id)
            setName(dataUpdate.name)
            setEmail(dataUpdate.email)
            setGender(dataUpdate.gender)
            setBirthday(dataUpdate.birthday ? dayjs(dataUpdate.birthday) : null)
            setAddress(dataUpdate.address)
            setMobile(dataUpdate.mobile)
            setAbout(dataUpdate.about)
            setAddress(dataUpdate.address)

            setSpecialization(dataUpdate.specialization)
            setDegree(dataUpdate.degree)
            setHospital(dataUpdate.hospital)
            setExperienceYears(dataUpdate.experienceYears)
            setBio(dataUpdate.bio)

        }
    }, [dataUpdate])

    const handleSubmitBtn = async () => {
        const res = await updateDoctorAPI(id ,name , email, gender , birthday , address , mobile , about ,
        specialization , degree , hospital , experienceYears , bio) ;
        if ( res.data){
            notification.success({
                message:"Cập nhật người dùng" ,
                description: "Cập nhật thành công"
            })
            setDataUpdate
            resetAndCloseModal()
            await loadDoctor() ;
        }
        else {
            notification.error({
                message:"Cập nhật thất bại" ,
                description: JSON.stringify(res.message)
            })
        }
    }
    const resetAndCloseModal = () => {
        setIsModalUpdateOpen(false)
        setDataUpdate(null)
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
        <Modal
            title="Cập nhật bác sĩ"
            open={isModalUpdateOpen}
            onOk={() => handleSubmitBtn()}
            onCancel={() => resetAndCloseModal()}
            okText={"Cập nhật"}
            cancelText={"Hủy"}
        >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 20px", padding: "12px 0" }}>
                <div>
                    <span>ID</span>
                    <Input
                        value={id}
                        disabled
                    />
                </div>
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
                        style={{ width: "100%" ,  popup: { root: { zIndex: 9999 } }  }}
                        value={birthday}
                        onChange={(date) => setBirthday(date)}
                        format="DD/MM/YYYY"
                        placeholder="Chọn ngày sinh"
                        placement="topRight"
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
    )
}
export default UpdateDoctorModal