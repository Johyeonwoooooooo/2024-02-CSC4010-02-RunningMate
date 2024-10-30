package RunningMate.backend.domain.authorization;

import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Component;

@Component
public class SessionUtils {
    public Long getUserIdFromSession(HttpSession session) {
        Object userId = session.getAttribute("userId");

        if (userId != null) {
            return (Long) userId;
        } else {
            return -1L;
        }
    }
}
