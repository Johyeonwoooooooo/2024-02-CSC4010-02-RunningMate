package RunningMate.backend.domain.User.service;

import RunningMate.backend.domain.User.dto.UserDTO;
import RunningMate.backend.domain.User.entity.User;

public interface UserService {
    User signUp(UserDTO.SignUpRequest request);
    User logIn(UserDTO.LoginRequest request);
}
