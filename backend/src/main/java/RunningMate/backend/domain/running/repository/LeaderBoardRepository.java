package RunningMate.backend.domain.running.repository;

import RunningMate.backend.domain.running.entity.LeaderBoard;
import RunningMate.backend.domain.running.entity.Record;
import RunningMate.backend.domain.running.entity.RunningGroup;
import RunningMate.backend.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LeaderBoardRepository extends JpaRepository<LeaderBoard, Long> {
    List<LeaderBoard> findAllByGroup(RunningGroup group);
    List<LeaderBoard> findAllByGroupOrderByRankingAsc(RunningGroup group);
    void deleteLeaderBoardByGroupAndRecord(RunningGroup group, Record record);
    LeaderBoard findLeaderBoardByRecord(Record record);
    boolean existsByGroupAndRecordUser(RunningGroup group, Optional<User> user);
}
