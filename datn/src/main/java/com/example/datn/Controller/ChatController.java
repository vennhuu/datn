package com.example.datn.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.datn.Domain.Message;
import com.example.datn.Domain.User;
import com.example.datn.Domain.response.message.MessageDTO;
import com.example.datn.Repository.MessageRepository;
import com.example.datn.Repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final MessageRepository messageRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository userRepository ;

    // Nhận tin từ client, lưu DB, gửi cho người nhận
    @MessageMapping("/chat.send")
    public void sendMessage(@Payload MessageDTO dto) {
        Message message = new Message();
        message.setSenderId(dto.getSenderId());
        message.setReceiverId(dto.getReceiverId());
        message.setContent(dto.getContent());
        messageRepository.save(message);

        dto.setCreatedAt(message.getCreatedAt());

        messagingTemplate.convertAndSend("/topic/chat." + dto.getReceiverId(), dto);
        messagingTemplate.convertAndSend("/topic/chat." + dto.getSenderId(), dto);
    }

    // REST API lấy lịch sử chat
    @GetMapping("/api/v1/messages/{userA}/{userB}")
    @ResponseBody
    public List<Message> getHistory(
        @PathVariable Long userA,
        @PathVariable Long userB
    ) {
        return messageRepository.findConversation(userA, userB);
    }

    @GetMapping("/api/v1/messages/conversations/{userId}")
    @ResponseBody
    public List<Map<String, Object>> getConversations(@PathVariable Long userId) {
        List<Long> userIds = messageRepository.findConversationUserIds(userId);

        return userIds.stream().map(otherId -> {
            User user = userRepository.findById(otherId).orElse(null);

            if (user != null) {
                System.out.println(">>> User id=" + user.getId() 
                    + " name=" + user.getName()    // thử getName()
                    + " email=" + user.getEmail()
                );
            }

            String lastMsg = messageRepository.findLastMessage(userId, otherId)
                .map(Message::getContent)
                .orElse("");

            Map<String, Object> map = new HashMap<>();
            map.put("userId", otherId);
            map.put("userName", user != null && user.getName() != null
                ? user.getName()
                : (user != null ? user.getEmail() : "Unknown"));
            map.put("userAvatar", user != null ? user.getAvatar() : null);
            map.put("lastMessage", lastMsg);
            return map;
        }).collect(Collectors.toList());
    }

    @PutMapping("/api/v1/messages/read/{receiverId}/{senderId}")
    @ResponseBody
    public void markAsRead(@PathVariable Long receiverId, @PathVariable Long senderId) {
        messageRepository.markAsRead(receiverId, senderId);
    }

}