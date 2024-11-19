package RunningMate.backend.domain.running.repository;

import RunningMate.backend.domain.running.entity.LeaderBoard;
import RunningMate.backend.domain.running.entity.Record;
import RunningMate.backend.domain.running.entity.RunningGroup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeaderBoardRepository extends JpaRepository<LeaderBoard, Long> {
    List<LeaderBoard> findAllByGroup(RunningGroup group);
    List<LeaderBoard> findAllByGroupOrderByRankingAsc(RunningGroup group);
    void deleteLeaderBoardByGroupAndRecord(RunningGroup group, Record record);
    LeaderBoard findLeaderBoardByRecord(Record record);

}
