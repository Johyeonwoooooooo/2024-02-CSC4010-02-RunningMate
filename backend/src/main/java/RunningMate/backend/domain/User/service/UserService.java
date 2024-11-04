package RunningMate.backend.domain.User.service;

import RunningMate.backend.domain.User.dto.UserDTO;
import RunningMate.backend.domain.User.entity.User;

import java.util.Optional;

public interface UserService {
    User signUp(UserDTO.SignUpRequest request);
    User logIn(UserDTO.LoginRequest request);
    UserDTO.GetProfileResponse profile(Optional<User> optionalUser);
    User updateProfile(UserDTO.UpdateProfileRequest request, Optional<User> optionalUser);
}
