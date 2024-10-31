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
import org.springframework.stereotype.Service;

import java.util.List;

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
    public Post uploadPost(CommunityDTO.PostUploadRequest request, User user) {

        String postTitle = request.getPostTitle();
        String postContent = request.getPostContent();
        List<PostImage> postImages = s3Service.uploadFile(request.getImages());
        Boolean postTag = request.getPostTag();

        Post post = Post.builder().postTitle(postTitle)
                .user(user)
                .postContent(postContent)
                .postImageList(postImages)
                .postTag(postTag)
                .likeCount(0L)
                .commentCount(0L)
                .build();
        return post;

    }
}
