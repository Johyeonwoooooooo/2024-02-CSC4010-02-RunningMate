package RunningMate.backend.domain.community.repository;

import RunningMate.backend.domain.community.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findTop15ByOrderByPostDateDesc();
    List<Post> findTop2ByPostTagTrueOrderByLikeCount();
    List<Post> findTop2ByPostTagFalseOrderByLikeCount();
}
