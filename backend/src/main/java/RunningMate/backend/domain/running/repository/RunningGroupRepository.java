package RunningMate.backend.domain.running.repository;

import RunningMate.backend.domain.running.entity.RunningGroup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface RunningGroupRepository extends JpaRepository<RunningGroup, Long> {
    List<RunningGroup> findAllByStartTimeAfter(LocalDateTime now);
    RunningGroup findByGroupId(Long groupId);
    void deleteAllByEndTimeBefore(LocalDateTime now);
    List<RunningGroup> findAllByEndTimeBefore(LocalDateTime now);
}
