package com.example.datn.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.datn.Domain.Doctor;
import com.example.datn.Domain.Review;
import com.example.datn.Domain.User;
import com.example.datn.Domain.request.ReviewRequestDTO;
import com.example.datn.Domain.response.review.ReviewResponseDTO;
import com.example.datn.Repository.DoctorRepository;
import com.example.datn.Repository.ReviewRepository;
import com.example.datn.Repository.UserRepository;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;

    public ReviewService(ReviewRepository reviewRepository, UserRepository userRepository,
            DoctorRepository doctorRepository) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
    }

    public ReviewResponseDTO create(ReviewRequestDTO dto, String email) {
        User user = userRepository.findByEmail(email);

        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        // Mỗi user chỉ review 1 lần
        if (reviewRepository.existsByUserAndDoctor(user, doctor)) {
            throw new RuntimeException("Bạn đã đánh giá bác sĩ này rồi");
        }

        Review review = new Review();
        review.setUser(user);
        review.setDoctor(doctor);
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());

        reviewRepository.save(review);
        return toDTO(review);
    }

    public List<ReviewResponseDTO> getByDoctor(Long doctorId) {
        return reviewRepository.findByDoctorIdOrderByIdDesc(doctorId)
                .stream().map(this::toDTO).toList();
    }

    private ReviewResponseDTO toDTO(Review r) {
        return ReviewResponseDTO.builder()
                .id(r.getId())
                .userName(r.getUser().getName())
                .userAvatar(r.getUser().getAvatar())
                .rating(r.getRating())
                .comment(r.getComment())
                .build();
    }
}