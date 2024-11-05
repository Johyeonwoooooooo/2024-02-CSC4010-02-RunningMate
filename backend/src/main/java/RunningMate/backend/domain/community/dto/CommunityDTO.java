package RunningMate.backend.domain.community.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

public class CommunityDTO {
    @Builder
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PostUploadRequest{
        private String postTitle;
        private Boolean postTag;
        private String postContent;
    }

    @Builder
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PostViewResponse {
        private Long postId;
        private String userNickname;
        private Long userId;
        private Long commentCount;
        private Long likeCount;
        private String postTitle;
        private String postContent;
        private Boolean postTag;
        private List<String> postImages;
    }

    @Builder
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CommentViewResponse {
        private Long postId;
        private Long userId;
        private String commentContent;
    }
}
