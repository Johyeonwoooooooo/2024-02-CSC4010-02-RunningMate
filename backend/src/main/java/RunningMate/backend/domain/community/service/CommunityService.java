package RunningMate.backend.domain.community.service;

import RunningMate.backend.domain.user.entity.User;
import RunningMate.backend.domain.community.dto.CommunityDTO;
import RunningMate.backend.domain.community.entity.Comment;
import RunningMate.backend.domain.community.entity.Post;
import RunningMate.backend.domain.community.entity.PostLike;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface CommunityService {
    Post uploadPost(CommunityDTO.PostUploadRequest request, List<MultipartFile> images, Optional<User> user);

    List<CommunityDTO.PostViewResponse> viewRunningSpotPost(Long postId, Optional<User> user);
    List<CommunityDTO.PostViewResponse> viewExerciseProofPost(Long postId, Optional<User> user);

    List<CommunityDTO.PostViewResponse> viewRunningSpotPost(Optional<User> user);

    List<CommunityDTO.PostViewResponse> viewExerciseProofPost(Optional<User> user);

    List<CommunityDTO.MainPagePostResponse> getMainPagePost();

    Comment addComment(CommunityDTO.CommentAddRequest request, Optional<User> user);

    List<CommunityDTO.CommentViewResponse> getComments(Long postId);

    PostLike addLike(Long postId, Optional<User> user);

    void deletePost(Long postId, Optional<User> user);
}
