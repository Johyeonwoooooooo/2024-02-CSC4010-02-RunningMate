package RunningMate.backend.domain.running.repository;

import RunningMate.backend.domain.running.entity.Record;
import RunningMate.backend.domain.running.entity.RunningGroup;
import RunningMate.backend.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RecordRepository extends JpaRepository<Record, Long> {
    Record findRecordByRecordId(Long recordId);
    void deleteRecordByRecordId(Long recordId);
    Record findByUserAndLeaderBoardGroup(Optional<User> user, RunningGroup group);
}
