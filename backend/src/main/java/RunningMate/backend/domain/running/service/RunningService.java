package RunningMate.backend.domain.running.service;

import RunningMate.backend.domain.running.entity.LeaderBoard;
import RunningMate.backend.domain.user.entity.User;
import RunningMate.backend.domain.running.dto.RunningDTO;
import RunningMate.backend.domain.running.entity.GroupTag;
import RunningMate.backend.domain.running.entity.RunningGroup;

import java.util.List;
import java.util.Optional;

public interface RunningService {
    RunningGroup makeRunningGroup(RunningDTO.MakeRunningGroupRequest request, Optional<User> optionalUser);
    List<RunningDTO.RunningGroupViewResponse> viewRunningGroups();
    RunningDTO.ParticipateGroupResponse participateGroup(Long groupId, Optional<User> optionalUser);
    RunningDTO.groupParticipantResponse groupParticipants(Long recordId);
    RunningDTO.ParticipateQuickRunningResponse participateQuickRunning(Optional<User> optionalUser);
    void cancelParticipation(Long recordId);
    List<RunningDTO.RunningGroupViewResponse> filteringGroup(GroupTag groupTag, String searchWord);
    void deactivateRunningGroup();
    List<RunningDTO.MainPageGroupResponse> mainPageGroups();
    void autoCreateQuickRunningGroup();
    RunningDTO.WhileRunningResponse whileRunning(RunningDTO.WhileRunningRequest request, Optional<User> optionalUser);
    String generateTTSMessage(Long recordId, Optional<User> optionalUser);
    List<RunningDTO.LeaderboardResponse> leaderboard(Long recordId, Optional<User> optionalUser);
}
