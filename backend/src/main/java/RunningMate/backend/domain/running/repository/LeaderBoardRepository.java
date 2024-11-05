package RunningMate.backend.domain.running.repository;

import RunningMate.backend.domain.running.entity.LeaderBoard;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeaderBoardRepository extends JpaRepository<LeaderBoard, Long> {

}
