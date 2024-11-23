package RunningMate.backend.domain.user.service;

import RunningMate.backend.domain.user.dto.UserDTO;
import RunningMate.backend.domain.user.entity.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    User signUp(UserDTO.SignUpRequest request);
    User logIn(UserDTO.LoginRequest request);
    UserDTO.GetProfileResponse profile(Optional<User> optionalUser);
    User updateProfile(UserDTO.UpdateProfileRequest request, Optional<User> optionalUser);
    List<UserDTO.MyPostResponse> viewMyPost(Optional<User> user);
    List<UserDTO.MyRecordResponse> viewMyRecord(Optional<User> user);
}
