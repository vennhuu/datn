import { useEffect, useState } from "react";
import { DatePicker, Input, Modal, notification, Select } from "antd";
import { updateHospitalAPI } from "../../../services/api.service.hospital";

const UpdateHospitalModal = (props) => {

    const {isModalUpdateOpen , setIsModalUpdateOpen , dataUpdate , setDataUpdate , loadHospital} = props ;

    const [id , setId] = useState("") ;
    const [name , setName] = useState("") ;
    const [city , setCity] = useState("") ;
    const [address , setAddress] = useState("") ;
    const [introduction , setIntroduction] = useState("") ;
    const [rating , setRating] = useState(0) ;

    useEffect(() => {
        if(dataUpdate) {
            setId(dataUpdate.id)
            setName(dataUpdate.name)
            setCity(dataUpdate.city)
            setAddress(dataUpdate.address)
            setIntroduction(dataUpdate.introduction)
            setRating(dataUpdate.rating)

        }
    }, [dataUpdate])

    const handleSubmitBtn = async () => {
        const res = await updateHospitalAPI(id ,name , city, introduction , address , rating) ;
        if ( res.data){
            notification.success({
                message:"Cập nhật bệnh viện" ,
                description: "Cập nhật thành công"
            })
            setDataUpdate
            resetAndCloseModal()
            await loadHospital() ;
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
        setCity("")
        setAddress("")
        setIntroduction("")
        setRating("")
    }

    return (
        <Modal
            title="Cập nhật bệnh viện"
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
                    <span>Tên bệnh viện</span>
                    <Input value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                    <span>Thành phố</span>
                    <Select
                        style={{ width: "100%" }}
                        value={city || undefined}
                        onChange={(value) => setCity(value)}
                        placeholder="Chọn thành phố"
                        options={[
                            { label: 'Hà Nội', value: 'HA_NOI' },
                            { label: 'Đà Nẵng', value: 'DA_NANG' },
                            { label: 'TP. Hồ Chí Minh', value: 'HO_CHI_MINH' }
                        ]}
                    />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                    <span>Địa chỉ</span>
                    <Input value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                    <span>Giới thiệu</span>
                    <Input value={introduction} onChange={(e) => setIntroduction(e.target.value)} />
                </div>
            </div>
        </Modal>
    )
}
export default UpdateHospitalModal