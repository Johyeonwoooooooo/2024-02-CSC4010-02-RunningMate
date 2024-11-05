package RunningMate.backend.domain.running.repository;

import RunningMate.backend.domain.running.entity.RunningGroup;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RunningGroupRepository extends JpaRepository<RunningGroup, Long> {

}
