package RunningMate.backend.domain.community.repository;

import RunningMate.backend.domain.community.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findTop14ByPostTagTrueOrderByLikeCountDesc();
    List<Post> findTop14ByPostTagFalseOrderByLikeCountDesc();
    List<Post> findTop2ByPostTagTrueOrderByLikeCount();
    List<Post> findTop2ByPostTagFalseOrderByLikeCount();
    List<Post> findTop15ByPostTagTrueOrderByPostDateDesc();
    List<Post> findTop15ByPostTagFalseOrderByPostDateDesc();
}
