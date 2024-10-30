package RunningMate.backend.domain.community.repository;

import RunningMate.backend.domain.community.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {
}
