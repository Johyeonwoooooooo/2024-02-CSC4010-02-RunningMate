package RunningMate.backend.domain.community.repository;

import RunningMate.backend.domain.community.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {
}
