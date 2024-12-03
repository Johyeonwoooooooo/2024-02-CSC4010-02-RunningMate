package RunningMate.backend.domain.community.repository;

import RunningMate.backend.domain.community.entity.PostImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostImageRepository extends JpaRepository<PostImage, Long> {
}
