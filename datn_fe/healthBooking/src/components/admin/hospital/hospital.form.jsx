import { Button, DatePicker, Form, Input, Modal, notification, Select, Upload } from "antd";
import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { createNewHospitalAPI, updateHospitalAvatarAPI } from "../../../services/api.service.hospital";

const HospitalForm = (props) => {
    const {loadHospital} = props;

    const [isModalOpen , setIsModalOpen] = useState(false) ;
    const [name , setName] = useState("") ;
    const [city , setCity] = useState("") ;
    const [address , setAddress] = useState("") ;
    const [introduction , setIntroduction] = useState("") ;
    const [rating , setRating] = useState(0) ;

    const [selectedFile, setSelectedFile] = useState(null)
    const [preview , setPreview] = useState(null)

    const handleOk = async () => {
        let logo = "";

        // 1. upload ảnh trước
        if (selectedFile) {
            const uploadRes = await updateHospitalAvatarAPI(selectedFile, "logo_hospital");

            if (uploadRes.data) {
                logo = uploadRes.data.fileName;
            } else {
                notification.error({
                    message: "Tải ảnh logo thất bại"
                });
                return;
            }
        }

        // 2. tạo hospital
        const res = await createNewHospitalAPI(name , city, introduction, logo , address , rating );

        if (res.data) {
            notification.success({
                title: "Tạo bệnh viện" ,
                description: "Tạo bệnh viện thành công"

            });
            resetAndCloseModal();
            await loadHospital();
        }
        else {
            notification.error({
                title: "Tạo bệnh viện thất bại" , 
                description: JSON.stringify(res.message)
            })
        }
    };

    const handleCancel = () => {
        resetAndCloseModal() ;
    }

    const resetAndCloseModal = () => {
        setIsModalOpen(false)
        setName("")
        setCity("")
        setAddress("")
        setIntroduction("")
        setRating("")
    }
    return (
        <>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px" ,
                marginBottom: "20px"
            }}>
                <h3>Danh sách bệnh viện</h3>
                <Button type="primary" onClick={() => setIsModalOpen(true)}>Thêm bệnh viện</Button>
            </div>
            <Modal
                title="Thêm bệnh viện"
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
                    <div>
                        <span>Logo</span>
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
export default HospitalForm ;