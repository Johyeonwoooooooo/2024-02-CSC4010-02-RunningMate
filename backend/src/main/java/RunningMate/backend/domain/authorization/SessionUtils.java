package RunningMate.backend.domain.authorization;

import RunningMate.backend.domain.user.entity.User;
import RunningMate.backend.domain.user.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class SessionUtils {
    private final UserRepository userRepository;
    public Optional<User> getUserFromSession(HttpSession session) {
        Object userId = session.getAttribute("userId");
        Optional<User> user = userRepository.findUserByUserId((Long) userId);
        return user;
    }

}
