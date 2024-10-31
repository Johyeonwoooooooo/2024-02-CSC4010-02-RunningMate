package RunningMate.backend.domain.community.repository;

import RunningMate.backend.domain.community.entity.Post;
import RunningMate.backend.domain.community.entity.PostLike;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostLikeRepository extends JpaRepository<PostLike, Long> {
}