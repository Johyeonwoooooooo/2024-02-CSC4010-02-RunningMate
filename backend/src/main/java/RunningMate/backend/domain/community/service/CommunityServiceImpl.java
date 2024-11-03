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
import org.springframework.web.multipart.MultipartFile;

import javax.swing.text.html.Option;
import java.util.ArrayList;
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

        post = postRepository.save(post);

        List<PostImage> updatedImages = new ArrayList<>();
        for (PostImage postImage : postImages) {
            postImage.setPost(post); // Post 참조 설정
            updatedImages.add(postImageRepository.save(postImage)); // 수정된 이미지 추가
        }

        post.getPostImageList().addAll(updatedImages);

        return postRepository.save(post);
    }
}
