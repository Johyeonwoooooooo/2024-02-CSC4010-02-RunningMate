package RunningMate.backend.domain.community.service;

import RunningMate.backend.domain.User.entity.User;
import RunningMate.backend.domain.community.dto.CommunityDTO;
import RunningMate.backend.domain.community.entity.Comment;
import RunningMate.backend.domain.community.entity.Post;
import RunningMate.backend.domain.community.entity.PostImage;
import RunningMate.backend.domain.community.entity.PostLike;
import RunningMate.backend.domain.community.repository.CommentRepository;
import RunningMate.backend.domain.community.repository.PostImageRepository;
import RunningMate.backend.domain.community.repository.PostLikeRepository;
import RunningMate.backend.domain.community.repository.PostRepository;
import RunningMate.backend.domain.community.s3.service.S3Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.time.LocalDateTime;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommunityServiceImpl implements CommunityService{
    private final PostRepository postRepository;
    private final PostImageRepository postImageRepository;
    private final CommentRepository commentRepository;
    private final PostLikeRepository likeRepository;
    private final S3Service s3Service;
    @Override
    public Post uploadPost(CommunityDTO.PostUploadRequest request,
                           List<MultipartFile> images, Optional<User> user) {
        if(user.isEmpty())
            throw new IllegalArgumentException("로그인이 필요한 서비스입니다.");

        String postTitle = request.getPostTitle();
        String postContent = request.getPostContent();
        List<PostImage> postImages = s3Service.uploadFile(images);
        Boolean postTag = request.getPostTag();

        Post post = Post.builder().postTitle(postTitle)
                    .user(user.get())
                    .postContent(postContent)
                    .postImageList(postImages)
                    .postTag(postTag)
                    .likeCount(0L)
                    .commentCount(0L)
                    .postDate(LocalDateTime.now())
                    .build();

        postImages.forEach(postImage -> postImage.setPost(post));
        return postRepository.save(post);
    }

    @Override
    public List<CommunityDTO.PostViewResponse> viewRunningSpotPost(Long postId) { // 메인페이지 -> 커뮤니티 넘어가는 경우
        List<CommunityDTO.PostViewResponse> postViewResponses = new ArrayList<>();
        postRepository.findById(postId).ifPresent(post -> postViewResponses.add(convertToDTO(post)));

        List<Post> posts = postRepository.findTop14ByPostTagTrueOrderByLikeCountDesc();

        posts.stream()
                .filter(post -> !post.getPostId().equals(postId))
                .map(this::convertToDTO)
                .forEach(postViewResponses::add);

        return postViewResponses;
    }

    @Override
    public List<CommunityDTO.PostViewResponse> viewExerciseProofPost(Long postId) {
        List<CommunityDTO.PostViewResponse> postViewResponses = new ArrayList<>();
        postRepository.findById(postId).ifPresent(post -> postViewResponses.add(convertToDTO(post)));

        List<Post> posts = postRepository.findTop14ByPostTagFalseOrderByLikeCountDesc();

        posts.stream()
                .filter(post -> !post.getPostId().equals(postId))
                .map(this::convertToDTO)
                .forEach(postViewResponses::add);

        return postViewResponses;
    }

    @Override
    public List<CommunityDTO.PostViewResponse> viewRunningSpotPost() {
        List<Post> posts = postRepository.findTop15ByPostTagTrueOrderByPostDateDesc();

        return posts.stream()
                .map(this::convertToDTO)
                .toList();
    }

    @Override
    public List<CommunityDTO.PostViewResponse> viewExerciseProofPost() {
        List<Post> posts = postRepository.findTop15ByPostTagFalseOrderByPostDateDesc();

        return posts.stream()
                .map(this::convertToDTO)
                .toList();
    }

    public List<CommunityDTO.MainPagePostResponse> getMainPagePost() {
        List<Post> runningSpotPosts = postRepository.findTop2ByPostTagTrueOrderByLikeCount();
        List<Post> runningCertificationPosts = postRepository.findTop2ByPostTagFalseOrderByLikeCount();

        return Stream.concat(runningSpotPosts.stream(), runningCertificationPosts.stream())
                .map(CommunityDTO.MainPagePostResponse::new)
                .toList();
    }

    @Override
    public Comment addComment(CommunityDTO.CommentAddRequest request, Optional<User> user) {
        if(user.isEmpty())
            throw new IllegalArgumentException("로그인이 필요한 서비스입니다.");

        Post post = postRepository.findById(request.getPostId()).orElse(null);
        if (post == null) {
            throw new IllegalArgumentException("게시글을 찾을 수 없습니다.");
        }

        Comment comment = Comment.builder()
                .user(user.get())
                .post(post)
                .commentContent(request.getCommentContent())
                .commentWriteTime(new Date())
                .build();

        post.setCommentCount(post.getCommentCount() + 1);
        commentRepository.save(comment);

        return comment;
    }

    @Override
    public List<CommunityDTO.CommentViewResponse> getComments(Long postId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));
        return post.getCommentList().stream().map(comment ->
                CommunityDTO.CommentViewResponse.builder()
                        .commentId(comment.getCommentId())
                        .userNickname(comment.getUser().getUserNickname())
                        .commentContent(comment.getCommentContent())
                        .commentWriteTime(comment.getCommentWriteTime())
                        .build()
        ).toList();
    }

    @Override
    public PostLike addLike(Long postId, Optional<User> user) {
        if(user.isEmpty())
            throw new IllegalArgumentException("로그인이 필요한 서비스입니다.");

        Post post = postRepository.findById(postId).orElseThrow(()
                -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        if (likeRepository.existsByUserAndPost(user.get(), post)) {
            throw new IllegalArgumentException("이미 좋아요를 누른 게시글입니다.");
        }

        PostLike like = PostLike.builder()
                .user(user.get())
                .post(post)
                .build();

        post.setLikeCount(post.getLikeCount() + 1);
        likeRepository.save(like);

        return likeRepository.save(like);
    }

    @Override
    public void deletePost(Long postId, Optional<User> user) {
        if(user.isEmpty())
            throw new IllegalArgumentException("로그인이 필요한 서비스입니다.");

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        if (user.get().getUserNickname().equals("admin")) { // 관리자는 모든 글 삭제 가능
            postRepository.delete(post);
            return;
        }

        if (!post.getUser().getUserId().equals(user.get().getUserId())) {
            throw new IllegalArgumentException("게시글을 삭제할 권한이 없습니다.");
        }

        postRepository.delete(post);
    }

    private CommunityDTO.PostViewResponse convertToDTO(Post post) {
        List<String> postImages = post.getPostImageList()
                .stream()
                .map(PostImage::getImageURL)
                .toList();

        return CommunityDTO.PostViewResponse.builder()
                .postId(post.getPostId())
                .userId(post.getUser().getUserId())
                .userNickname(post.getUser().getUserNickname())
                .commentCount(post.getCommentCount())
                .likeCount(post.getLikeCount())
                .postContent(post.getPostContent())
                .postTitle(post.getPostTitle())
                .postDate(post.getPostDate())
                .postImages(postImages)
                .build();
    }
}
