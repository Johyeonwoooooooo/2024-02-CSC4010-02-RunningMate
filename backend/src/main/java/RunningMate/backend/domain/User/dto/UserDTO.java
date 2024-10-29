package RunningMate.backend.domain.User.dto;

import lombok.Builder;
import lombok.Getter;

//https://github.com/Like-House/BE/blob/develop/src/main/java/backend/like_house/domain/user/dto/UserDTO.java 참고해서 만듦
public class UserDTO {

    @Builder
    @Getter
    public static class LoginRequest{
        private String userEmail;
        private String userPassword;
    }

    @Builder
    @Getter
    public static class SignUpRequest {
        private String userNickname;
        private String userEmail;
        private String userPassword;
        private Long userWeight;
        private Long userHeight;
    }

    @Builder
    @Getter
    public static class GetProfileResponse {
        private Long userId;
        private String userNickname;
        private Long userWeight;
        private Long userHeight;
    }

    @Getter
    @Builder
    public static class UpdateProfileRequest {
        private Long userWeight;
        private Long userHeight;
    }

}
