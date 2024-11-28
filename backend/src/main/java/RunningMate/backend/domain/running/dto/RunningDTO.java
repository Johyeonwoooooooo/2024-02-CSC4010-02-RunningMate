package RunningMate.backend.domain.running.dto;

import RunningMate.backend.domain.running.entity.GroupTag;
import RunningMate.backend.domain.running.entity.LeaderBoard;
import RunningMate.backend.domain.running.entity.Record;
import RunningMate.backend.domain.running.entity.RunningGroup;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

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
        private Long targetDistance;
        private Duration runningTime;
        private Double calories;

        public ParticipateGroupResponse(Record record){
            this.recordId = record.getRecordId();
            this.targetDistance = record.getDistance();
            this.runningTime = record.getRunningTime();
            this.calories = record.getCalories();
        }
    }

    @Builder
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class groupParticipantResponse {
        private String groupTitle;
        private GroupTag groupTag;
        private Long targetDistance;
        private LocalDateTime startTime;
        private LocalDateTime endTime;
        private Integer maxParticipants;
        private Integer currentParticipants;
        private List<String> participants;
    }

    @Builder
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ParticipateQuickRunningResponse {
        private Long recordId;
        private Duration runningTime;
        private Double calories;
        public ParticipateQuickRunningResponse(Record record){
            this.recordId = record.getRecordId();
            this.runningTime = record.getRunningTime();
            this.calories = record.getCalories();
        }
    }

    @Builder
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WhileRunningRequest {
        private Long recordId;
        private Duration runningTime;
        private Double calories;
        private Long distance;

    }

    @Builder
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WhileRunningResponse{
        private List<WhileRunningLeaderboardResponse> leaderboardResponseList;
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WhileRunningLeaderboardResponse {
        private String userNickname;
        private Long rank;
        private Boolean isMyRecord;
        private String rankChange;
        private Double distance;

        public WhileRunningLeaderboardResponse(LeaderBoard leaderBoard, Long rank, String rankChange){
            this.userNickname = leaderBoard.getRecord().getUser().getUserNickname();
            this.rank = leaderBoard.getCurrentRanking();
            this.isMyRecord = false;
            if(this.rank.equals(rank))
                this.isMyRecord = true;

            this.rankChange = "same";
            if(isMyRecord)
                this.rankChange = rankChange;
            this.distance = Double.valueOf(leaderBoard.getRecord().getDistance()) / 1000;
        }
    }

    @Builder
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LeaderboardResponse {
        private Long ranking;
        private String userNickname;
        private boolean yourRecord;
        private Long distance;

        public LeaderboardResponse(LeaderBoard leaderBoard, boolean yourRecord){
            this.ranking = leaderBoard.getCurrentRanking();
            this.userNickname = leaderBoard.getRecord().getUser().getUserNickname();
            this.distance = leaderBoard.getRecord().getDistance();
            this.yourRecord = yourRecord;
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
