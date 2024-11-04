package RunningMate.backend.domain.community.service;

import RunningMate.backend.domain.User.entity.User;
import RunningMate.backend.domain.community.dto.CommunityDTO;
import RunningMate.backend.domain.community.entity.Post;
import RunningMate.backend.domain.community.entity.PostImage;
import RunningMate.backend.domain.community.repository.CommentRepository;
import RunningMate.backend.domain.community.repository.PostImageRepository;
import RunningMate.backend.domain.community.repository.PostLikeRepository;
import RunningMate.backend.domain.community.repository.PostRepository;
import RunningMate.backend.domain.community.s3.service.S3Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

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
            return null;

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
                .build();

        postImages.forEach(postImage -> postImage.setPost(post));
        return postRepository.save(post);
    }

    @Override
    public List<CommunityDTO.PostViewResponse> viewPost() {
        List<Post> postList = postRepository.findAll();
        Collections.shuffle(postList);
        List<Post> posts = postList.subList(0, Math.min(15, postList.size()));

        return posts.stream().map(post -> {
            List<String> postImages = post.getPostImageList()
                    .stream()
                    .map(PostImage::getImageURL)
                    .toList();

            return CommunityDTO.PostViewResponse.builder()
                    .postId(post.getPostId())
                    .userId(post.getUser().getUserId())
                    .userNickname(post.getUser().getUserNickname())
                    .postTag(post.getPostTag())
                    .commentCount(post.getCommentCount())
                    .likeCount(post.getLikeCount())
                    .postContent(post.getPostContent())
                    .postTitle(post.getPostTitle())
                    .postImages(postImages)
                    .build();
        }).toList();
    }
}
