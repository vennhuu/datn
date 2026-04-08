    package com.example.datn.Repository;

    import java.util.List;
    import java.util.Optional;

    import org.springframework.data.jpa.repository.JpaRepository;
    import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
    import org.springframework.stereotype.Repository;

    import com.example.datn.Domain.Doctor;
    import com.example.datn.Domain.User;

    @Repository
    public interface DoctorRepository extends JpaRepository<Doctor, Long> , JpaSpecificationExecutor<Doctor> {
        public boolean existsById(long id) ;

        public List<Doctor> findByHospitalId( long id ) ;

        public Optional<Doctor> findByUser(User user);

    }
