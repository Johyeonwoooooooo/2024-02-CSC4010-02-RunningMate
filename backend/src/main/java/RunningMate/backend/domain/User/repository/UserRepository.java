package RunningMate.backend.domain.User.repository;

import RunningMate.backend.domain.User.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findUserByUserNickname(String userNickname);
    Optional<User> findUserByUserEmail(String userEmail);
    Optional<User> findUserByUserEmailAndUserPassword(String userEmail, String userPassword);
}
