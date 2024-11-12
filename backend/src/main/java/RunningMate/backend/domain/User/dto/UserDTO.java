package RunningMate.backend.domain.User.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

//https://github.com/Like-House/BE/blob/develop/src/main/java/backend/like_house/domain/user/dto/UserDTO.java 참고해서 만듦
@AllArgsConstructor
public class UserDTO {

    @Builder
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest{
        private String userEmail;
        private String userPassword;
    }

    @Builder
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SignUpRequest {
        private String userNickname;
        private String userEmail;
        private String userPassword;
        private Long userWeight;
        private Long userHeight;
    }

    @Builder
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GetProfileResponse {
        private String userNickname;
        private Long userWeight;
        private Long userHeight;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateProfileRequest {
        private String userNickname;
        private Long userWeight;
        private Long userHeight;
    }

    @Builder
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MyPostResponse {
        private Long postId;
        private String postTitle;
        private String postContent;
        private LocalDateTime postDate;
    }

}
