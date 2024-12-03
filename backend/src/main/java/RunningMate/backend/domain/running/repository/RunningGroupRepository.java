package RunningMate.backend.domain.running.repository;

import RunningMate.backend.domain.running.entity.GroupTag;
import RunningMate.backend.domain.running.entity.RunningGroup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface RunningGroupRepository extends JpaRepository<RunningGroup, Long> {
    List<RunningGroup> findAllByActivateTrueAndGroupTagNotOrderByStartTimeAsc(GroupTag groupTag);
    RunningGroup findByGroupId(Long groupId);
    RunningGroup findByGroupTagAndActivateTrue(GroupTag groupTag);
    List<RunningGroup> findAllByGroupTagAndActivateTrue(GroupTag groupTag);
    List<RunningGroup> findAllByEndTimeBeforeAndActivateTrue(LocalDateTime now);
    List<RunningGroup> findAllByGroupTagAndGroupTitleContainsAndActivateTrue(GroupTag groupTag, String search);
    List<RunningGroup> findAllByGroupTitleContainsAndActivateTrue(String search);
}
