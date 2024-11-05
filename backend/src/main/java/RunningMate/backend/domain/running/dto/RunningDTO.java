package RunningMate.backend.domain.running.dto;

import RunningMate.backend.domain.running.entity.GroupTag;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class RunningDTO {
    @Builder
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RunningGroupViewResponse {
        private Long groupId;
        private String groupTitle;
        private LocalDateTime startTime;
        private LocalDateTime endTime;
        private Long targetDistance;
        private GroupTag groupTag;
    }
}
