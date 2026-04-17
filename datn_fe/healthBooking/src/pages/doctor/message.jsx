import { useState, useEffect, useRef } from "react";
import { SendOutlined, SearchOutlined } from "@ant-design/icons";
import useChat from "../../hooks/useChat";
import useConversations from "../../hooks/useConversations"; // ✅ hook mới

const getAvatarColor = (name) => {
  const colors = ["#1d4ed8", "#0e9a57", "#f59e0b", "#8b5cf6", "#ef4444", "#0a6abf"];
  return colors[(name?.charCodeAt(0) || 0) % colors.length];
};

const Message = () => {
  const currentUser = (() => {
    try { return JSON.parse(localStorage.getItem("user")); }
    catch { return null; }
  })();

  const [selectedUser, setSelectedUser] = useState(null);
  const [input, setInput] = useState("");
  const [searchConv, setSearchConv] = useState("");
  const bottomRef = useRef(null);

  const { conversations, markAsRead } = useConversations(currentUser?.id);
  const { messages, connected, sendMessage } = useChat(currentUser?.id, selectedUser?.id);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectUser = (conv) => {
    setSelectedUser({ id: conv.userId, name: conv.userName, avatar: conv.userAvatar });
    markAsRead(conv.userId); 
  };

  const handleSend = () => {
    if (!input.trim() || !selectedUser) return;
    sendMessage(input);
    setInput("");
  };

  const filteredConvs = conversations.filter((c) =>
    c.userName?.toLowerCase().includes(searchConv.toLowerCase())
  );

  const formatTime = (ts) => {
    if (!ts) return "Vừa xong";
    return new Date(ts).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div style={s.root}>
      {/* Sidebar */}
      <div style={s.sidebar}>
        <div style={s.sidebarHead}>
          <h3 style={s.sidebarTitle}>Tin nhắn</h3>
          {conversations.length > 0 && (
            <span style={s.sidebarCount}>{conversations.length}</span>
          )}
        </div>

        <div style={s.searchWrap}>
          <SearchOutlined style={{ color: "#94a3b8", fontSize: 13 }} />
          <input
            style={s.searchInput}
            placeholder="Tìm cuộc trò chuyện..."
            value={searchConv}
            onChange={(e) => setSearchConv(e.target.value)}
          />
        </div>

        <div style={s.convList}>
          {filteredConvs.length === 0 ? (
            <div style={s.emptyConv}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>💬</div>
              <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>
                {searchConv ? "Không tìm thấy" : "Chưa có cuộc trò chuyện nào"}
              </p>
            </div>
          ) : (
            filteredConvs.map((conv) => {
              const isSelected = selectedUser?.id === conv.userId;
              return (
                <div
                  key={conv.userId}
                  onClick={() => handleSelectUser(conv)}
                  style={{
                    ...s.convItem,
                    background: isSelected ? "#eef4ff" : "transparent",
                    borderLeft: `3px solid ${isSelected ? "#0a6abf" : "transparent"}`,
                  }}
                >
                  <div style={{ ...s.convAvt, background: getAvatarColor(conv.userName), overflow: "hidden" }}>
                    {conv.userAvatar
                      ? <img src={`${import.meta.env.VITE_BACKEND_URL}/storage/avt_patient/${conv.userAvatar}`}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : conv.userName?.[0]
                    }
                  </div>
                  <div style={s.convInfo}>
                    <p style={{ ...s.convName, color: isSelected ? "#0a6abf" : "#0f172a" }}>
                      {conv.userName}
                    </p>
                    <p style={s.convLast}>{conv.lastMessage || "Chưa có tin nhắn"}</p>
                  </div>

                  {conv.unreadCount > 0 && !isSelected && (
                    <div style={s.badge}>{conv.unreadCount > 99 ? "99+" : conv.unreadCount}</div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Chat area - giữ nguyên như cũ */}
      <div style={s.chatArea}>
        {!selectedUser ? (
          <div style={s.emptyChat}>
            <div style={s.emptyChatIcon}>💬</div>
            <p style={s.emptyChatTitle}>Chọn một cuộc trò chuyện</p>
            <p style={s.emptyChatSub}>Chọn từ danh sách bên trái để bắt đầu nhắn tin</p>
          </div>
        ) : (
          <>
            <div style={s.chatHead}>
              <div style={{ ...s.chatHeadAvt, background: getAvatarColor(selectedUser.name), overflow: "hidden" }}>
                {selectedUser.avatar
                  ? <img src={`${import.meta.env.VITE_BACKEND_URL}/storage/avt_patient/${selectedUser.avatar}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : selectedUser.name?.[0]
                }
              </div>
              <div>
                <p style={s.chatHeadName}>{selectedUser.name}</p>
                <p style={{ ...s.chatHeadStatus, color: connected ? "#22c55e" : "#94a3b8" }}>
                  <span style={{
                    display: "inline-block", width: 7, height: 7, borderRadius: "50%",
                    background: connected ? "#22c55e" : "#94a3b8", marginRight: 5,
                  }} />
                  {connected ? "Đang hoạt động" : "Đang kết nối..."}
                </p>
              </div>
            </div>

            <div style={s.msgArea}>
              {messages.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px 0", color: "#94a3b8" }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>👋</div>
                  <p style={{ fontSize: 14, margin: 0 }}>Hãy bắt đầu cuộc trò chuyện!</p>
                </div>
              ) : (
                messages.map((msg, i) => {
                  const isMine = Number(msg.senderId) === Number(currentUser?.id);
                  return (
                    <div key={i} style={{ display: "flex", justifyContent: isMine ? "flex-end" : "flex-start", marginBottom: 10 }}>
                      {!isMine && (
                        <div style={{ ...s.msgAvt, background: getAvatarColor(selectedUser.name), marginRight: 8 }}>
                          {selectedUser.name?.[0]}
                        </div>
                      )}
                      <div style={{
                        maxWidth: "60%", padding: "10px 14px",
                        borderRadius: isMine ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                        background: isMine ? "#0a6abf" : "#fff",
                        color: isMine ? "#fff" : "#0f172a",
                        fontSize: 14, lineHeight: 1.6,
                        boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
                      }}>
                        {msg.content}
                        <div style={{ fontSize: 11, marginTop: 4, textAlign: "right", color: isMine ? "rgba(255,255,255,0.6)" : "#94a3b8" }}>
                          {formatTime(msg.createdAt)}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={bottomRef} />
            </div>

            <div style={s.inputArea}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={`Nhắn tin với ${selectedUser.name}...`}
                style={s.textInput}
                onFocus={(e) => (e.target.style.borderColor = "#0a6abf")}
                onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
              />
              <button
                onClick={handleSend}
                style={{ ...s.sendBtn, background: input.trim() ? "#0a6abf" : "#e2e8f0", cursor: input.trim() ? "pointer" : "default" }}
              >
                <SendOutlined style={{ color: "#fff", fontSize: 15 }} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const s = {
  root: { display: "flex", height: "calc(100vh - 64px)", background: "#f0f4f8" },
  sidebar: { width: 300, background: "#fff", display: "flex", flexDirection: "column", borderRight: "1px solid #f1f5f9", flexShrink: 0 },
  sidebarHead: { padding: "20px 16px 12px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" },
  sidebarTitle: { margin: 0, fontSize: 16, fontWeight: 700, color: "#0f172a" },
  sidebarCount: { background: "#eef4ff", color: "#0a6abf", fontSize: 12, fontWeight: 600, padding: "2px 10px", borderRadius: 20 },
  searchWrap: { display: "flex", alignItems: "center", gap: 8, margin: "10px 12px", padding: "8px 12px", background: "#f8fafc", borderRadius: 10, border: "1.5px solid #f1f5f9" },
  searchInput: { flex: 1, border: "none", outline: "none", fontSize: 13, background: "transparent", color: "#0f172a" },
  convList: { flex: 1, overflowY: "auto" },
  emptyConv: { textAlign: "center", padding: "40px 16px" },
  convItem: { display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", cursor: "pointer", transition: "all .12s" },
  convAvt: { width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 16, flexShrink: 0 },
  convInfo: { flex: 1, overflow: "hidden" },
  convName: { margin: 0, fontWeight: 600, fontSize: 14 },
  convLast: { margin: 0, fontSize: 12, color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 2 },
  // ✅ Badge style
  badge: { minWidth: 20, height: 20, borderRadius: 10, background: "#ef4444", color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5px", flexShrink: 0 },
  chatArea: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
  emptyChat: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
  emptyChatIcon: { fontSize: 52, marginBottom: 16 },
  emptyChatTitle: { fontSize: 16, fontWeight: 600, color: "#334155", margin: 0 },
  emptyChatSub: { fontSize: 13, color: "#94a3b8", marginTop: 6 },
  chatHead: { background: "#fff", padding: "0 24px", height: 64, display: "flex", alignItems: "center", gap: 12, boxShadow: "0 1px 8px rgba(0,0,0,0.06)", flexShrink: 0, borderBottom: "1px solid #f1f5f9" },
  chatHeadAvt: { width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 15 },
  chatHeadName: { margin: 0, fontWeight: 700, fontSize: 15, color: "#0f172a" },
  chatHeadStatus: { margin: 0, fontSize: 12, display: "flex", alignItems: "center" },
  msgArea: { flex: 1, overflowY: "auto", padding: "20px 32px", display: "flex", flexDirection: "column" },
  msgAvt: { width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 600, fontSize: 12, flexShrink: 0, alignSelf: "flex-end" },
  inputArea: { background: "#fff", padding: "12px 24px", borderTop: "1px solid #f1f5f9", display: "flex", gap: 12, alignItems: "center" },
  textInput: { flex: 1, padding: "11px 18px", borderRadius: 24, border: "1.5px solid #e2e8f0", fontSize: 14, outline: "none", background: "#f8fafc", color: "#0f172a", transition: "border-color .15s" },
  sendBtn: { width: 44, height: 44, borderRadius: "50%", border: "none", display: "flex", alignItems: "center", justifyContent: "center", transition: "background .15s" },
};

export default Message;