package RunningMate.backend.domain.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

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
        private List<String> postImages;
    }

}
