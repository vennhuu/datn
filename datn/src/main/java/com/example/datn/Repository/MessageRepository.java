package com.example.datn.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.datn.Domain.Message;

import jakarta.transaction.Transactional;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    // Lấy lịch sử chat giữa 2 người
    @Query("""
        SELECT m FROM Message m
        WHERE (m.senderId = :userA AND m.receiverId = :userB)
           OR (m.senderId = :userB AND m.receiverId = :userA)
        ORDER BY m.createdAt ASC
    """)
    List<Message> findConversation(
        @Param("userA") Long userA,
        @Param("userB") Long userB
    );
    
        // Lấy danh sách người đã nhắn tin với doctor
    @Query("""
        SELECT DISTINCT m.senderId FROM Message m
        WHERE m.receiverId = :doctorId
        UNION
        SELECT DISTINCT m.receiverId FROM Message m
        WHERE m.senderId = :doctorId
    """)
    List<Long> findConversationUserIds(@Param("doctorId") Long doctorId);

    // Thay method cũ bằng query này
    @Query("""
        SELECT m FROM Message m
        WHERE (m.senderId = :userA AND m.receiverId = :userB)
        OR (m.senderId = :userB AND m.receiverId = :userA)
        ORDER BY m.createdAt DESC
        LIMIT 1
    """)
    Optional<Message> findLastMessage(@Param("userA") Long userA, @Param("userB") Long userB);

    @Modifying
    @Transactional
    @Query("UPDATE Message m SET m.isRead = true WHERE m.receiverId = :receiverId AND m.senderId = :senderId AND m.isRead = false")
    void markAsRead(@Param("receiverId") Long receiverId, @Param("senderId") Long senderId);
}