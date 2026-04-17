import { useState, useEffect, useRef, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axios from "axios";

const useConversations = (currentUserId) => {
  const [conversations, setConversations] = useState([]);
  const clientRef = useRef(null);

  // Load danh sách conversations ban đầu
  useEffect(() => {
    if (!currentUserId) return;
    axios
      .get(`/api/v1/messages/conversations/${currentUserId}`)
      .then((res) => {
        const data = res.data?.data ?? res.data;
        setConversations(Array.isArray(data) ? data : []);
    })
      .catch(() => {});
  }, [currentUserId]);

  // Lắng nghe WebSocket để update sidebar real-time
  useEffect(() => {
    if (!currentUserId) return;
    const token = localStorage.getItem("access_token");

    const client = new Client({
      webSocketFactory: () =>
        new SockJS(`${import.meta.env.VITE_BACKEND_URL}/ws`),
      connectHeaders: { Authorization: "Bearer " + token },
      onConnect: () => {
        client.subscribe(`/topic/chat.${currentUserId}`, (frame) => {
          const msg = JSON.parse(frame.body);
          const partnerId =
            Number(msg.senderId) === Number(currentUserId)
              ? Number(msg.receiverId)
              : Number(msg.senderId);
          const isIncoming = Number(msg.senderId) !== Number(currentUserId);

          setConversations((prev) => {
            const exists = prev.find((c) => c.userId === partnerId);
            if (exists) {
              return prev.map((c) => {
                if (c.userId !== partnerId) return c;
                return {
                  ...c,
                  lastMessage: msg.content,
                  // Chỉ tăng unread nếu là tin nhắn đến VÀ conversation này không đang được mở
                  unreadCount: isIncoming
                    ? (c.unreadCount || 0) + 1
                    : c.unreadCount || 0,
                };
              });
            } else {
              // Conversation mới chưa có trong list → thêm vào đầu
              return [
                {
                  userId: partnerId,
                  userName: msg.senderName || "Người dùng",
                  userAvatar: msg.senderAvatar || null,
                  lastMessage: msg.content,
                  unreadCount: isIncoming ? 1 : 0,
                },
                ...prev,
              ];
            }
          });
        });
      },
      reconnectDelay: 3000,
    });

    client.activate();
    clientRef.current = client;
    return () => client.deactivate();
  }, [currentUserId]);

  // Gọi khi user mở conversation → reset unread về 0
  const markAsRead = useCallback((partnerId) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.userId === partnerId ? { ...c, unreadCount: 0 } : c
      )
    );
    // Gọi API đánh dấu đã đọc
    axios
      .put(`/api/v1/messages/read/${currentUserId}/${partnerId}`)
      .catch(() => {});
  }, [currentUserId]);

  return { conversations, markAsRead };
};

export default useConversations;