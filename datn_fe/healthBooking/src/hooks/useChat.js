import { useEffect, useRef, useState, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axios from "../services/axios.customize";

const useChat = (currentUserId, receiverId) => {
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const clientRef = useRef(null);
  const receiverIdRef = useRef(receiverId);
  const pendingRef = useRef(new Map());

  useEffect(() => {
    receiverIdRef.current = receiverId;
  }, [receiverId]);

  useEffect(() => {
    if (!currentUserId || !receiverId) return;
    setMessages([]);
    pendingRef.current.clear();
    axios
      .get(`/api/v1/messages/${currentUserId}/${receiverId}`)
      .then((res) => setMessages(res.data || []))
      .catch(() => setMessages([]));
  }, [currentUserId, receiverId]);

  useEffect(() => {
    if (!currentUserId) return;
    const token = localStorage.getItem("access_token");

    const client = new Client({
      webSocketFactory: () =>
        new SockJS(`${import.meta.env.VITE_BACKEND_URL}/ws`),
      connectHeaders: { Authorization: "Bearer " + token },
      onConnect: () => {
        setConnected(true);
        client.subscribe(`/topic/chat.${currentUserId}`, (frame) => {
          const msg = JSON.parse(frame.body);
          const myId = Number(currentUserId);
          const rid = Number(receiverIdRef.current);
          const sid = Number(msg.senderId);
          const toId = Number(msg.receiverId);

          const isRelevant =
            (sid === myId && toId === rid) || (sid === rid && toId === myId);
          if (!isRelevant) return;

          if (sid === myId) {
            const key = `${toId}:${msg.content}`;
            if (pendingRef.current.has(key)) {
              pendingRef.current.delete(key);
              return;
            }
          }

          setMessages((prev) => [
            ...prev,
            {
              ...msg,
              senderId: Number(msg.senderId),
              receiverId: Number(msg.receiverId),
            },
          ]);
        });
      },
      onDisconnect: () => setConnected(false),
      reconnectDelay: 3000,
    });

    client.activate();
    clientRef.current = client;
    return () => client.deactivate();
  }, [currentUserId]);

  const sendMessage = useCallback(
    (content) => {
      if (!content.trim() || !receiverIdRef.current) return;
      const myId = Number(currentUserId);
      const rid = Number(receiverIdRef.current);

      const newMsg = {
        senderId: myId,
        receiverId: rid,
        content: content.trim(),
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, newMsg]);

      const key = `${rid}:${content.trim()}`;
      pendingRef.current.set(key, true);
      setTimeout(() => pendingRef.current.delete(key), 5000);

      if (clientRef.current?.connected) {
        clientRef.current.publish({
          destination: "/app/chat.send",
          body: JSON.stringify({
            senderId: myId,
            receiverId: rid,
            content: content.trim(),
          }),
        });
      }
    },
    [currentUserId]
  );

  return { messages, connected, sendMessage };
};

export default useChat;