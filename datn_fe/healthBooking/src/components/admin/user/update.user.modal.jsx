import { useEffect, useState } from "react";
import { updateUserAPI } from "../../../services/api.service.user";
import { DatePicker, Input, Modal, notification, Select } from "antd";

const UpdateUserModal = (props) => {

    const {isModalUpdateOpen , setIsModalUpdateOpen , dataUpdate , setDataUpdate , loadUser} = props ;

    const [id , setId] = useState("") ;
    const [name , setName] = useState("") ;
    const [email , setEmail] = useState("") ;
    const [gender , setGender] = useState("") ;
    const [birthday , setBirthday] = useState(null) ;
    const [address , setAddress] = useState("") ;
    const [mobile , setMobile] = useState("") ;
    const [about , setAbout] = useState("") ;
    const [password , setPassword] = useState("") ;

    useEffect(() => {
        if(dataUpdate) {
            setId(dataUpdate.id)
            setName(dataUpdate.name)
            setEmail(dataUpdate.email)
            setGender(dataUpdate.gender)
            setBirthday(dataUpdate.birthday)
            setAddress(dataUpdate.address)
            setMobile(dataUpdate.mobile)
            setAbout(dataUpdate.about)
            setAddress(dataUpdate.address)
        }
    }, [dataUpdate])

    const handleSubmitBtn = async () => {
        const res = await updateUserAPI(id, name , email, password, gender , birthday , address , mobile , about) ;
        if ( res.data){
            notification.success({
                message:"Cập nhật người dùng" ,
                description: "Cập nhật thành công"
            })
            setDataUpdate
            resetAndCloseModal()
            await loadUser() ;
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
            title="Cập nhật bệnh nhân"
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
            </div>
            </Modal>
    )
}
export default UpdateUserModal