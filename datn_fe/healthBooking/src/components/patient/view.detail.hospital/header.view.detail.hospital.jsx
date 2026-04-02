const HeaderViewHospital = () => {
    <div style={{
                    display: "flex",
                    gap: 20,
                    marginBottom: 30,
                    background: "#fff",
                    padding: 20,
                    borderRadius: 16,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
                }}>
                    <img
                        src={`${import.meta.env.VITE_BACKEND_URL}/storage/logo_hospital/${data.logo}`}
                        alt=""
                        style={{
                            width: 120,
                            height: 120,
                            objectFit: "cover",
                            borderRadius: 12
                        }}
                    />
    
                    <div>
                        <h2 style={{ marginBottom: 10 }}>{data.name}</h2>
    
                        <p style={{ color: "#64748b" }}>
                            <EnvironmentOutlined /> {data.address}
                        </p>
    
                        <Rate disabled value={data.rating} allowHalf />
                    </div>
                </div>
}
export default HeaderViewHospital ;