package RunningMate.backend.domain.community.service;

import RunningMate.backend.domain.User.entity.User;
import RunningMate.backend.domain.community.dto.CommunityDTO;
import RunningMate.backend.domain.community.entity.Post;

public interface CommunityService {
    Post uploadPost(CommunityDTO.PostUploadRequest request, User user);
}
