package RunningMate.backend.domain.community.controller;

import RunningMate.backend.domain.User.entity.User;
import RunningMate.backend.domain.authorization.SessionUtils;
import RunningMate.backend.domain.community.dto.CommunityDTO;
import RunningMate.backend.domain.community.entity.Comment;
import RunningMate.backend.domain.community.entity.Post;
import RunningMate.backend.domain.community.entity.PostImage;
import RunningMate.backend.domain.community.entity.PostLike;
import RunningMate.backend.domain.community.repository.PostRepository;
import RunningMate.backend.domain.community.service.CommunityService;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/community")
public class CommunityController {
    private final CommunityService communityService;
    private final SessionUtils sessionUtils;
    private final ObjectMapper objectMapper;

    @PostMapping(value = "/post/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "커뮤니티 게시글 작성", description = "{\n" +
            "    \"postTitle\": \"테스트 제목\",\n" +
            "    \"postTag\": true,\n" +
            "    \"postContent\": \"테스트 내용입니다.\"\n" +
            "}")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "글 등록 성공"),
            @ApiResponse(responseCode = "400", description = "글 등록 실패")
    })
    public ResponseEntity<?> uploadPost(@RequestParam("request") String request,
                                        @RequestParam("image") List<MultipartFile> images,
                                        HttpSession session) {
        try {
            // JSON 문자열을 DTO 객체로 변환
            CommunityDTO.PostUploadRequest postUploadRequest = objectMapper.readValue(request, CommunityDTO.PostUploadRequest.class);

            Optional<User> optionalUser = sessionUtils.getUserFromSession(session);
            Post post = communityService.uploadPost(postUploadRequest, images, optionalUser);

            if (post == null) {
                return ResponseEntity.badRequest().body("글 등록에 실패하였습니다.");
            } else {
                return ResponseEntity.ok(post.getPostId() + post.getPostTitle() + post.getPostContent() + post.getPostImageList() + post.getUser());
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/post/get/{postId}/running-spot")
    @Operation(summary = "메인 페이지를 통한 러닝 스팟 게시글 확인", description = "메인 페이지를 통해 러닝 스팟 공유 게시글을 확인한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "404", description = "게시글을 찾을 수 없음")
    })
    public ResponseEntity<?> getClickedRunningSpotPosts(@PathVariable("postId") Long postId) {
        try {
            List<CommunityDTO.PostViewResponse> postResponse = communityService.viewRunningSpotPost(postId);
            return ResponseEntity.ok(postResponse);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/post/get/{postId}/exercise-proof")
    @Operation(summary = "메인 페이지를 통한 운동 인증 게시글 확인", description = "메인 페이지를 통해 운동 인증 게시글을 확인한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "404", description = "게시글을 찾을 수 없음")
    })
    public ResponseEntity<?> getClickedExerciseProofPosts(@PathVariable("postId") Long postId) {
        try {
            List<CommunityDTO.PostViewResponse> postResponse = communityService.viewExerciseProofPost(postId);
            return ResponseEntity.ok(postResponse);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/post/get/running-spot")
    @Operation(summary = "러닝 스팟 공유 게시글 확인", description = "커뮤니티 탭에서 러닝 스팟 공유 게시글을 확인한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "404", description = "게시글을 찾을 수 없음")
    })
    public ResponseEntity<?> getRunningSpotPosts() {
        List<CommunityDTO.PostViewResponse> posts = communityService.viewRunningSpotPost();
        if (posts.isEmpty()) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.ok(posts);
        }
    }

    @GetMapping("/post/get/exercise-proof")
    @Operation(summary = "운동 인증 게시글 확인", description = "커뮤니티 탭에서 운동 인증 게시글을 확인한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "404", description = "게시글을 찾을 수 없음")
    })
    public ResponseEntity<?> getExerciseProofPosts() {
        List<CommunityDTO.PostViewResponse> posts = communityService.viewExerciseProofPost();
        if (posts.isEmpty()) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.ok(posts);
        }
    }

    @PostMapping("/post/{postId}/comment")
    @Operation(summary = "게시글 댓글 등록", description = "커뮤니티에 올라온 게시글에 댓글을 작성한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "404", description = "댓글을 작성할 수 없음")
    })
    public ResponseEntity<?> addPostComments(@RequestBody CommunityDTO.CommentAddRequest request,
                                             HttpSession session) {

        try {
            Optional<User> optionalUser = sessionUtils.getUserFromSession(session);
            Comment comment = communityService.addComment(request, optionalUser);

            if (comment == null) {
                return ResponseEntity.badRequest().body("댓글 등록에 실패하였습니다.");
            } else {
                return ResponseEntity.ok(comment.getCommentId() + comment.getCommentContent() + comment.getCommentWriteTime() + comment.getUser());
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/post/{postId}/comments")
    @Operation(summary = "커뮤니티 게시글 댓글 확인", description = "커뮤니티에 올라온 게시글의 댓글을 확인한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "204", description = "댓글이 없음"),
            @ApiResponse(responseCode = "404", description = "게시글을 찾을 수 없음")
    })
    public ResponseEntity<?> getPostCommentViews(@PathVariable("postId") Long postId) {
        try {
            List<CommunityDTO.CommentViewResponse> comments = communityService.getComments(postId);
            if (comments.isEmpty()) {
                return ResponseEntity.noContent().build(); // 댓글 없을 때
            } else {
                return ResponseEntity.ok(comments);
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PostMapping("/post/{postId}/like")
    @Operation(summary = "커뮤니티 게시글 좋아요 등록", description = "커뮤니티에 올라온 게시글에 좋아요를 누른다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "좋아요 등록 성공"),
            @ApiResponse(responseCode = "404", description = "좋아요를 등록할 수 없음")
    })
    public ResponseEntity<?> addPostLike(@PathVariable("postId") Long postId,
                                         HttpSession session) {

        try {
            Optional<User> optionalUser = sessionUtils.getUserFromSession(session);
            PostLike like = communityService.addLike(postId, optionalUser);

            return ResponseEntity.ok("좋아요 등록에 성공하였습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/post/{postId}/delete")
    @Operation(summary = "커뮤니티 게시글 삭제", description = "커뮤니티에 등록한 게시글을 삭제한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "삭제 성공"),
            @ApiResponse(responseCode = "403", description = "삭제 권한이 없음"),
            @ApiResponse(responseCode = "404", description = "게시글을 찾을 수 없음")
    })
    public ResponseEntity<?> deletePost(@PathVariable("postId") Long postId,
                                        HttpSession session) {
        try {
            Optional<User> optionalUser = sessionUtils.getUserFromSession(session);
            communityService.deletePost(postId, optionalUser);

            return ResponseEntity.ok("게시글 삭제에 성공하였습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage()); // 권한 없을 때 403
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage()); // 게시글 없을 때 404
        }
    }
}
