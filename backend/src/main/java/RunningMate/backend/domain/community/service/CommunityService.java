package RunningMate.backend.domain.community.service;

import RunningMate.backend.domain.User.entity.User;
import RunningMate.backend.domain.community.dto.CommunityDTO;
import RunningMate.backend.domain.community.entity.Comment;
import RunningMate.backend.domain.community.entity.Post;
import RunningMate.backend.domain.community.entity.PostLike;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface CommunityService {
    Post uploadPost(CommunityDTO.PostUploadRequest request, List<MultipartFile> images, Optional<User> user);

    List<CommunityDTO.PostViewResponse> viewPost();

    List<CommunityDTO.MainPagePostResponse> getMainPagePost();

    Comment addComment(CommunityDTO.CommentAddRequest request, Optional<User> user);

    List<CommunityDTO.CommentViewResponse> getComments(Long postId);

    PostLike addLike(Long postId, Optional<User> user);

    Post deletePost(Long postId, Optional<User> user);
}
