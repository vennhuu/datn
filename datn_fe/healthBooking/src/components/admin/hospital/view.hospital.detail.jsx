import { Button, Drawer, notification } from "antd";
import { useState } from "react";
import { DEGREE_LABEL, SPECIALIZATION_LABEL } from "../../../constant/doctor.constant";
import { updateHospitalAvatarAPI, updateHospitalLogoAPI } from "../../../services/api.service.hospital";

const ViewHospitalDetail = (props) => {

    const {showDrawer , setShowDrawer , dataDetail , setDataDetail , loadHospital} = props ;

    const [selectedFile, setSelectedFile] = useState(null)
    const [preview , setPreview] = useState(null)

    const handleUpdateHospitalLogo = async () => {

        const resUpload = await updateHospitalAvatarAPI(selectedFile,"logo_hospital")

        if (!resUpload.data) {
        notification.error({
            message: "Upload thất bại",
            description: resUpload.message || "Đã có lỗi xảy ra"
        })
        return  // ← dừng lại, không chạy tiếp
    }

        if(resUpload.data){

            const logo = resUpload.data.fileName

            const resUpdateAvatar = await updateHospitalLogoAPI(
                dataDetail.id,
                logo
            )

            if(resUpdateAvatar.data){
                notification.success({
                    message:"Cập nhật logo",
                    description:"Thành công"
                })

                setPreview(null)
                setSelectedFile(null)

                // reload danh sách
                await loadHospital()

                // đóng drawer
                setShowDrawer(false)
                setDataDetail(null)
            }
            else {
                notification.error({
                    message: "Cập nhật logo" , 
                    description: JSON.stringify(resUpload.message)
                })
            }
        }
    }

    return (
        <Drawer
            title={null}
            closable={false}
            onClose={() => { setDataDetail(null); setShowDrawer(false); }}
            open={showDrawer}
            size={360}
            styles={{
                body: { padding: 0, background: "#f8fafc" },
                wrapper: { boxShadow: "-4px 0 24px rgba(0,0,0,0.08)" }
            }}
        >
            {dataDetail ? (
                <div>
                    {/* Header banner */}
                    <div style={{
                        background: "linear-gradient(135deg, #1677ff 0%, #0958d9 100%)",
                        padding: "32px 24px 48px",
                        position: "relative"
                    }}>
                        <button
                            onClick={() => { setDataDetail(null); setShowDrawer(false); }}
                            style={{
                                position: "absolute", top: 16, right: 16,
                                background: "rgba(255,255,255,0.2)", border: "none",
                                color: "#fff", width: 32, height: 32, borderRadius: "50%",
                                cursor: "pointer", fontSize: 16, display: "flex",
                                alignItems: "center", justifyContent: "center"
                            }}
                        >✕</button>

                        {/* Avatar */}
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                            <div style={{
                                width: 90, height: 90, borderRadius: "50%",
                                overflow: "hidden", border: "3px solid rgba(255,255,255,0.6)",
                                boxShadow: "0 4px 16px rgba(0,0,0,0.2)", background: "#e6f4ff"
                            }}>
                                <img
                                    src={`${import.meta.env.VITE_BACKEND_URL}/storage/logo_hospital/${dataDetail.logo}`}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${dataDetail.name}&background=1677ff&color=fff&size=90` }}
                                />
                            </div>
                            <div style={{ textAlign: "center" }}>
                                <div style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>{dataDetail.name}</div>
                            </div>
                        </div>
                    </div>
                    {/* Info card - overlap the banner */}
                    <div style={{ margin: "0 16px", marginTop: -20, borderRadius: 12, background: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", padding: "20px 20px 8px" }}>

                        {/* USER INFO */}
                        {[
                            { icon: "🪪", label: "ID", value: `#${dataDetail.id}` },
                            { icon: "📱", label: "Thành phố", value: dataDetail.city || "—" },
                            { icon: "📍", label: "Địa chỉ", value: dataDetail.address || "—" },
                            { icon: "🎂", label: "Giới thiệu", value: dataDetail.introduction || "—" },
                            { icon: "📍", label: "Đánh giá", value: dataDetail.rating || "—" },
                        ].map((item, i) => (
                            <div key={i} style={{
                                display: "flex", gap: 12,
                                padding: "10px 0",
                                borderBottom: "1px solid #f0f0f0"
                            }}>
                                <span>{item.icon}</span>
                                <div>
                                    <div style={{ fontSize: 11, color: "#999" }}>{item.label}</div>
                                    <div style={{ fontSize: 14, fontWeight: 500 }}>{item.value}</div>
                                </div>
                            </div>
                        ))}

                    </div>

                    {/* Upload avatar */}
                    <div style={{ margin: "16px 16px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
                        <label htmlFor="btnUpload" style={{
                            display: "flex", alignItems: "center", justifyContent: "center",
                            gap: 8, padding: "10px",
                            background: "#fff", border: "1.5px dashed #1677ff",
                            borderRadius: 8, cursor: "pointer", color: "#1677ff",
                            fontWeight: 500, fontSize: 14, transition: "background 0.2s"
                        }}>
                            📷 Cập nhật ảnh đại diện
                        </label>
                        <input
                            type="file"
                            hidden
                            id="btnUpload"
                            onChange={(event) => {
                                const file = event.target.files[0];
                                if (file) {
                                    setSelectedFile(file);
                                    setPreview(URL.createObjectURL(file));
                                }
                            }}
                        />

                        {preview && (
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                                <div style={{ width: 80, height: 80, borderRadius: "50%", overflow: "hidden", border: "2px solid #1677ff" }}>
                                    <img src={preview} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                </div>
                                <Button
                                    type="primary"
                                    style={{ width: "100%", borderRadius: 8 }}
                                    onClick={handleUpdateHospitalLogo}
                                >
                                    Lưu ảnh
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#999" }}>
                    Không có dữ liệu
                </div>
            )}
        </Drawer>
    );
}

export default ViewHospitalDetail;