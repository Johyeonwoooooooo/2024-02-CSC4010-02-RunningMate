package RunningMate.backend.domain.running.repository;

import RunningMate.backend.domain.running.entity.Record;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecordRepository extends JpaRepository<Record, Long> {

}
