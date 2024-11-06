package RunningMate.backend.domain.running.dto;

import RunningMate.backend.domain.running.entity.GroupTag;
import RunningMate.backend.domain.running.entity.Record;
import RunningMate.backend.domain.running.entity.RunningGroup;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

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

        public RunningGroupViewResponse(RunningGroup group){
            this.groupId = group.getGroupId();
            this.groupTitle = group.getGroupTitle();
            this.startTime = group.getStartTime();
            this.endTime = group.getEndTime();
            this.targetDistance = group.getTargetDistance();
            this.groupTag = group.getGroupTag();
        }
    }

    @Builder
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MakeRunningGroupRequest {
        private String groupTitle;
        private LocalDateTime startTime;
        private LocalDateTime endTime;
        private Long targetDistance;
        private GroupTag groupTag;
        private Integer maxParticipants;
    }

    @Builder
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ParticipateGroupResponse {
        private Long recordId;
        private Long distance;
        private Long runningTime;
        private Long calories;

        public ParticipateGroupResponse(Record record){
            this.recordId = record.getRecordId();
            this.distance = record.getDistance();
            this.runningTime = record.getRunningTime();
            this.calories = record.getCalories();
        }
    }

    @Builder
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MainPageGroupResponse {
        private Long groupId;
        private String groupTitle;
        private LocalDateTime startTime;
        private LocalDateTime endTime;
        private Long targetDistance;
        private GroupTag groupTag;

        public MainPageGroupResponse(RunningGroup group){
            this.groupId = group.getGroupId();
            this.groupTitle = group.getGroupTitle();
            this.startTime = group.getStartTime();
            this.endTime = group.getEndTime();
            this.targetDistance = group.getTargetDistance();
            this.groupTag = group.getGroupTag();
        }
    }
}
