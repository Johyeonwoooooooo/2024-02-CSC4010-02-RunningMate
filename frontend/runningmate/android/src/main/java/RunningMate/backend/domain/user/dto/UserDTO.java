package RunningMate.backend.domain.user.dto;

import RunningMate.backend.domain.running.entity.Record;
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

    @Builder
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MyRecordResponse { // 날짜, 거리, 일주일 거리 총합
        private LocalDateTime recordDate;
        private Double dailyDistance;
        private Double weekDistance; // 총 거리
        private Double weekCalories; // 총 칼로리

        public MyRecordResponse(Record record) {
            this.recordDate = record.getRunningStartTime().atStartOfDay(); // LocalDate to LocalDateTime
            this.dailyDistance = record.getDistance() / 1000.0;
            this.weekDistance = 0.0; // 계산 후 세팅
            this.weekCalories = 0.0; // 계산 후 세팅
        }
    }
}
