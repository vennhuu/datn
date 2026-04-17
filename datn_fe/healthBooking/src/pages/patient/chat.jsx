import { useState, useEffect, useRef } from "react";
import { SendOutlined } from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
import useChat from "../../hooks/useChat";
import axios from "../../services/axios.customize";
import useConversations from "../../hooks/useConversations";

const Chat = () => {
  const currentUser = (() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  })();

  const [searchParams] = useSearchParams();
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  const { messages, connected, sendMessage } = useChat(currentUser?.id, selectedDoctor?.id);


  useEffect(() => {
    const doctorId = searchParams.get("doctorId");
    const doctorName = searchParams.get("doctorName");
    const doctorAvatar = searchParams.get("doctorAvatar");
    if (doctorId) {
      setSelectedDoctor({
        id: Number(doctorId),
        name: doctorName || "Bác sĩ",
        avatar: doctorAvatar || null,
      });
    }
  }, [searchParams]);

  const { conversations: doctors, markAsRead } = useConversations(currentUser?.id);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !selectedDoctor) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <div style={{ display: "flex", height: "calc(100vh - 64px)", background: "#f0f4f8" }}>

      {/* Sidebar */}
      <div style={{
        width: 300, background: "#fff", borderRight: "1px solid #f1f5f9",
        display: "flex", flexDirection: "column", flexShrink: 0,
      }}>
        <div style={{ padding: "20px 16px 12px", borderBottom: "1px solid #f1f5f9" }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
            💬 Tin nhắn
          </h3>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {/* ✅ Hiển thị bác sĩ đang chat nếu chưa có trong danh sách */}
          {selectedDoctor && !doctors.find(d => d.userId === selectedDoctor.id) && (
            <div
              onClick={() => setSelectedDoctor(selectedDoctor)}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 16px", cursor: "pointer",
                background: "#eef4ff",
                borderLeft: "3px solid #0a6abf",
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
                background: "#0a6abf", display: "flex", alignItems: "center",
                justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 16,
                overflow: "hidden",
              }}>
                {selectedDoctor.avatar && selectedDoctor.avatar !== "null"
                  ? <img src={`${import.meta.env.VITE_BACKEND_URL}/storage/avt_doctor/${selectedDoctor.avatar}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : selectedDoctor.name?.[0]
                }
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: "#0f172a" }}>
                  {selectedDoctor.name}
                </p>
                <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>Cuộc trò chuyện mới</p>
              </div>
            </div>
          )}

          {doctors.length === 0 && !selectedDoctor ? (
            <div style={{ textAlign: "center", padding: "40px 16px", color: "#94a3b8", fontSize: 13 }}>
              Chưa có cuộc trò chuyện nào
            </div>
          ) : (
            doctors.map((conv) => (
              <div
                key={conv.userId}
                onClick={() => {
                  setSelectedDoctor({ id: conv.userId, name: conv.userName, avatar: conv.userAvatar });
                  markAsRead(conv.userId);
                }}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 16px", cursor: "pointer",
                  background: selectedDoctor?.id === conv.userId ? "#eef4ff" : "transparent",
                  borderLeft: selectedDoctor?.id === conv.userId ? "3px solid #0a6abf" : "3px solid transparent",
                  transition: "all .15s",
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
                  background: "#0a6abf", display: "flex", alignItems: "center",
                  justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 16,
                  overflow: "hidden",
                }}>
                  {conv.userAvatar
                    ? <img src={`${import.meta.env.VITE_BACKEND_URL}/storage/avt_doctor/${conv.userAvatar}`}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : conv.userName?.[0]
                  }
                </div>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: "#0f172a" }}>
                    {conv.userName}
                  </p>
                  <p style={{ margin: 0, fontSize: 12, color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {conv.lastMessage}
                  </p>
                </div>
                {conv.unreadCount > 0 && selectedDoctor?.id !== conv.userId && (
                  <div style={{
                    minWidth: 20, height: 20, borderRadius: 10,
                    background: "#ef4444", color: "#fff",
                    fontSize: 11, fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "0 5px", flexShrink: 0,
                  }}>
                    {conv.unreadCount > 99 ? "99+" : conv.unreadCount}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Khung chat */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {!selectedDoctor ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center", color: "#94a3b8" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
              <p style={{ fontSize: 15 }}>Chọn một cuộc trò chuyện để bắt đầu</p>
            </div>
          </div>
        ) : (
          <>
            <div style={{
              background: "#fff", padding: "0 24px", height: 64,
              display: "flex", alignItems: "center", gap: 12,
              boxShadow: "0 1px 8px rgba(0,0,0,0.06)", flexShrink: 0,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%", background: "#0a6abf",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 700, overflow: "hidden",
              }}>
                {selectedDoctor.avatar && selectedDoctor.avatar !== "null"
                  ? <img src={`${import.meta.env.VITE_BACKEND_URL}/storage/avt_doctor/${selectedDoctor.avatar}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : selectedDoctor.name?.[0]
                }
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "#0f172a" }}>
                  {selectedDoctor.name}
                </p>
                <p style={{ margin: 0, fontSize: 12, color: connected ? "#22c55e" : "#94a3b8" }}>
                  {connected ? "Đang hoạt động" : "Đang kết nối..."}
                </p>
              </div>
            </div>

            <div style={{
              flex: 1, overflowY: "auto", padding: "24px 32px",
              display: "flex", flexDirection: "column", gap: 10,
            }}>
              {messages.map((msg, i) => {
                const isMine = Number(msg.senderId) === Number(currentUser?.id);
                return (
                  <div key={i} style={{ display: "flex", justifyContent: isMine ? "flex-end" : "flex-start" }}>
                    <div style={{
                      maxWidth: "60%", padding: "10px 14px",
                      borderRadius: isMine ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                      background: isMine ? "#0a6abf" : "#fff",
                      color: isMine ? "#fff" : "#0f172a",
                      fontSize: 14, lineHeight: 1.6,
                      boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                    }}>
                      {msg.content}
                      <div style={{ fontSize: 11, marginTop: 4, textAlign: "right", color: isMine ? "rgba(255,255,255,0.65)" : "#94a3b8" }}>
                        {msg.createdAt
                          ? new Date(msg.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
                          : "Vừa xong"}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            <div style={{
              background: "#fff", padding: "12px 32px",
              borderTop: "1px solid #f1f5f9",
              display: "flex", gap: 12, alignItems: "center",
            }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSend()}
                placeholder="Nhập tin nhắn..."
                style={{
                  flex: 1, padding: "12px 18px", borderRadius: 24,
                  border: "1.5px solid #e2e8f0", fontSize: 14, outline: "none", background: "#f8fafc",
                }}
                onFocus={e => e.target.style.borderColor = "#0a6abf"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"}
              />
              <button onClick={handleSend} style={{
                width: 44, height: 44, borderRadius: "50%",
                background: input.trim() ? "#0a6abf" : "#e2e8f0",
                border: "none", cursor: input.trim() ? "pointer" : "default",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <SendOutlined style={{ color: "#fff", fontSize: 16 }} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;