import { useState, useRef, useEffect } from "react";

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChatIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const BotIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="8" width="18" height="13" rx="3" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 3V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="3" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="8.5" cy="13.5" r="1.5" fill="currentColor"/>
    <circle cx="15.5" cy="13.5" r="1.5" fill="currentColor"/>
    <path d="M9 17.5C9.5 18.3 10.2 18.8 12 18.8C13.8 18.8 14.5 18.3 15 17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M7 8H17" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const TypingDots = () => (
  <div style={{ display: "flex", gap: 4, alignItems: "center", padding: "4px 2px" }}>
    {[0, 1, 2].map(i => (
      <div key={i} style={{
        width: 7, height: 7, borderRadius: "50%",
        background: "#94a3b8",
        animation: "bounce 1.2s ease-in-out infinite",
        animationDelay: `${i * 0.2}s`
      }} />
    ))}
    <style>{`
      @keyframes bounce {
        0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
        40% { transform: scale(1); opacity: 1; }
      }
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(16px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.96); }
        to   { opacity: 1; transform: scale(1); }
      }
      @keyframes popIn {
        0%   { transform: scale(0.8); opacity: 0; }
        70%  { transform: scale(1.08); }
        100% { transform: scale(1); opacity: 1; }
      }
    `}</style>
  </div>
);

const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Xin chào! Tôi có thể giúp bạn đặt lịch khám, tìm bác sĩ hoặc tư vấn chuyên khoa. Bạn cần hỗ trợ gì?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chatbot/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.text })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setMessages(prev => [...prev, { role: "bot", text: data.data?.reply || "Xin lỗi, không có phản hồi." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "bot", text: "Có lỗi kết nối, vui lòng thử lại." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .cw-widget { position: fixed; bottom: 28px; right: 28px; z-index: 9999; font-family: 'Segoe UI', sans-serif; }
        .cw-panel {
          width: 360px;
          height: 520px;
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.14), 0 4px 16px rgba(0,0,0,0.08);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          margin-bottom: 16px;
          animation: slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1);
          border: 1px solid #e8edf3;
        }
        .cw-header {
          padding: 16px 18px;
          background: linear-gradient(135deg, #0a6abf 0%, #0e8fd4 100%);
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .cw-avatar {
          width: 36px; height: 36px;
          background: rgba(255,255,255,0.18);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          color: white;
          flex-shrink: 0;
        }
        .cw-header-info { flex: 1; }
        .cw-header-title { color: white; font-weight: 600; font-size: 14px; line-height: 1.3; }
        .cw-header-sub { color: rgba(255,255,255,0.75); font-size: 12px; display: flex; align-items: center; gap: 4px; margin-top: 1px; }
        .cw-online-dot { width: 6px; height: 6px; border-radius: 50%; background: #4ade80; display: inline-block; }
        .cw-close-btn {
          width: 30px; height: 30px;
          background: rgba(255,255,255,0.15);
          border: none; border-radius: 8px;
          color: white; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.15s;
        }
        .cw-close-btn:hover { background: rgba(255,255,255,0.25); }
        .cw-messages {
          flex: 1; overflow-y: auto;
          padding: 16px 14px;
          display: flex; flex-direction: column; gap: 10px;
          background: #f8fafc;
        }
        .cw-messages::-webkit-scrollbar { width: 4px; }
        .cw-messages::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .cw-msg-row { display: flex; gap: 8px; animation: fadeIn 0.2s ease; }
        .cw-msg-row.user { flex-direction: row-reverse; }
        .cw-msg-avatar {
          width: 28px; height: 28px;
          background: #e0edf8;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          color: #0a6abf;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .cw-bubble {
          max-width: 74%;
          padding: 10px 13px;
          border-radius: 14px;
          font-size: 13.5px;
          line-height: 1.55;
        }
        .cw-bubble.bot {
          background: #ffffff;
          color: #1e293b;
          border-radius: 4px 14px 14px 14px;
          border: 1px solid #e8edf3;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
        }
        .cw-bubble.user {
          background: linear-gradient(135deg, #0a6abf, #0e8fd4);
          color: white;
          border-radius: 14px 4px 14px 14px;
        }
        .cw-typing {
          display: flex; gap: 8px; align-items: flex-start;
          animation: fadeIn 0.2s ease;
        }
        .cw-typing-bubble {
          background: #ffffff;
          border: 1px solid #e8edf3;
          border-radius: 4px 14px 14px 14px;
          padding: 8px 13px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
        }
        .cw-input-area {
          padding: 12px 14px;
          background: #ffffff;
          border-top: 1px solid #e8edf3;
          display: flex; gap: 8px; align-items: center;
        }
        .cw-input {
          flex: 1;
          padding: 9px 14px;
          border-radius: 12px;
          border: 1.5px solid #e2e8f0;
          font-size: 13.5px;
          outline: none;
          background: #f8fafc;
          color: #1e293b;
          transition: border-color 0.15s;
          font-family: inherit;
        }
        .cw-input:focus { border-color: #0a6abf; background: #fff; }
        .cw-input::placeholder { color: #94a3b8; }
        .cw-send-btn {
          width: 38px; height: 38px;
          border-radius: 12px;
          background: #0a6abf;
          border: none;
          color: white;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: background 0.15s, transform 0.1s;
        }
        .cw-send-btn:hover { background: #0857a0; }
        .cw-send-btn:active { transform: scale(0.93); }
        .cw-send-btn:disabled { background: #cbd5e1; cursor: not-allowed; }
        .cw-toggle {
          width: 54px; height: 54px;
          border-radius: 16px;
          background: linear-gradient(135deg, #0a6abf, #0e8fd4);
          border: none;
          color: white;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 6px 20px rgba(10,106,191,0.4);
          transition: transform 0.2s, box-shadow 0.2s;
          animation: popIn 0.35s cubic-bezier(0.34,1.56,0.64,1);
          float: right;
        }
        .cw-toggle:hover { transform: scale(1.08); box-shadow: 0 8px 24px rgba(10,106,191,0.5); }
        .cw-toggle:active { transform: scale(0.95); }
      `}</style>

      <div className="cw-widget">
        {open && (
          <div className="cw-panel">
            {/* Header */}
            <div className="cw-header">
              <div className="cw-avatar"><BotIcon /></div>
              <div className="cw-header-info">
                <div className="cw-header-title">Trợ lý đặt lịch khám</div>
                <div className="cw-header-sub">
                  <span className="cw-online-dot" />
                  Đang hoạt động
                </div>
              </div>
              <button className="cw-close-btn" onClick={() => setOpen(false)}>
                <CloseIcon />
              </button>
            </div>

            {/* Messages */}
            <div className="cw-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`cw-msg-row ${msg.role}`}>
                  {msg.role === "bot" && (
                    <div className="cw-msg-avatar"><BotIcon /></div>
                  )}
                  <div className={`cw-bubble ${msg.role}`}>{msg.text}</div>
                </div>
              ))}
              {loading && (
                <div className="cw-typing">
                  <div className="cw-msg-avatar"><BotIcon /></div>
                  <div className="cw-typing-bubble"><TypingDots /></div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="cw-input-area">
              <input
                ref={inputRef}
                className="cw-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                placeholder="Nhắn tin..."
              />
              <button
                className="cw-send-btn"
                onClick={sendMessage}
                disabled={loading || !input.trim()}
              >
                <SendIcon />
              </button>
            </div>
          </div>
        )}

        <button className="cw-toggle" onClick={() => setOpen(o => !o)}>
          {open ? <CloseIcon /> : <ChatIcon />}
        </button>
      </div>
    </>
  );
};

export default ChatbotWidget;