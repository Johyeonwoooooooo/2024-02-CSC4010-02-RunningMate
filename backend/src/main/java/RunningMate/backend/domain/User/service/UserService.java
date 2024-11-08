package RunningMate.backend.domain.User.service;

import RunningMate.backend.domain.User.dto.UserDTO;
import RunningMate.backend.domain.User.entity.User;
import RunningMate.backend.domain.community.dto.CommunityDTO;

import java.util.List;
import java.util.Optional;

public interface UserService {
    User signUp(UserDTO.SignUpRequest request);
    User logIn(UserDTO.LoginRequest request);
    UserDTO.GetProfileResponse profile(Optional<User> optionalUser);
    User updateProfile(UserDTO.UpdateProfileRequest request, Optional<User> optionalUser);
    List<UserDTO.MyPostResponse> viewMyPost(Optional<User> user);
}
