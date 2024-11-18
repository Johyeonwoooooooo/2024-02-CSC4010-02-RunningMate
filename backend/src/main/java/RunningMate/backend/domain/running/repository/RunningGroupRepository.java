package RunningMate.backend.domain.running.repository;

import RunningMate.backend.domain.running.entity.GroupTag;
import RunningMate.backend.domain.running.entity.RunningGroup;
import org.springframework.cglib.core.Local;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface RunningGroupRepository extends JpaRepository<RunningGroup, Long> {
    List<RunningGroup> findAllByStartTimeAfter(LocalDateTime now);
    RunningGroup findByGroupId(Long groupId);
    RunningGroup findByGroupTagAndActivate(GroupTag groupTag, Boolean activate);
    List<RunningGroup> findAllByGroupTagAndActivate(GroupTag groupTag, Boolean activate);
    void deleteAllByEndTimeBefore(LocalDateTime now);
    List<RunningGroup> findAllByEndTimeBefore(LocalDateTime now);
    List<RunningGroup> findAllByGroupTagAndGroupTitleContainsAndStartTimeAfter(GroupTag groupTag, String search, LocalDateTime now);
    List<RunningGroup> findAllByGroupTitleContainsAndStartTimeAfter(String search, LocalDateTime now);
}
