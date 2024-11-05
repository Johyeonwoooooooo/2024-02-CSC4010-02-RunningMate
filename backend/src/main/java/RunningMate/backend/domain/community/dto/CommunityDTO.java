package RunningMate.backend.domain.community.dto;

import RunningMate.backend.domain.community.entity.Comment;
import RunningMate.backend.domain.community.entity.Post;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
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
        private LocalDateTime postDate;
    }

    @Builder
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MainPagePostResponse {
        private Long postId;
        private String userNickname;
        private Long likeCount;
        private String postTitle;
        private Boolean postTag;
        private LocalDateTime postDate;

        public MainPagePostResponse(Post post) {
            this.postId = post.getPostId();
            this.postTitle = post.getPostTitle();
            this.likeCount = post.getLikeCount();
            this.userNickname = post.getUser().getUserNickname();
            this.postDate = post.getPostDate();
            this.postTag = post.getPostTag();
        }
    }

    @Builder
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CommentAddRequest {
        private Long postId;
        private String commentContent;
    }

    @Builder
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CommentViewResponse {
        private Long commentId;
        private String userNickname;
        private String commentContent;
        private Date commentWriteTime;

        public CommentViewResponse(Comment comment) {
            this.commentId = comment.getCommentId();
            this.userNickname = comment.getUser().getUserNickname();
            this.commentContent = comment.getCommentContent();
            this.commentWriteTime = comment.getCommentWriteTime();
        }
    }

    @Builder
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PostLikeRequest {
        private Long postId;
    }
}
