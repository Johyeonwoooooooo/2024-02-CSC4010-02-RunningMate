package RunningMate.backend.domain.running.service;

import RunningMate.backend.domain.user.entity.User;
import RunningMate.backend.domain.running.dto.RunningDTO;
import RunningMate.backend.domain.running.entity.GroupTag;
import RunningMate.backend.domain.running.entity.Record;
import RunningMate.backend.domain.running.entity.RunningGroup;

import java.time.Duration;
import java.util.List;
import java.util.Optional;

public interface RunningService {
    RunningGroup makeRunningGroup(RunningDTO.MakeRunningGroupRequest request, Optional<User> optionalUser);
    List<RunningDTO.RunningGroupViewResponse> viewRunningGroups();
    RunningDTO.ParticipateGroupResponse participateGroup(Long groupId, Optional<User> optionalUser);
    RunningDTO.groupParticipantResponse groupParticipants(Long groupId);
    RunningDTO.ParticipateQuickRunningResponse participateQuickRunning(Optional<User> optionalUser);
    void cancelParticipation(RunningDTO.CancelParticipationRequest request);
    List<RunningDTO.RunningGroupViewResponse> filteringGroup(GroupTag groupTag, String searchWord);
    void deleteRunningGroup();
    RunningDTO.WhileRunningResponse whileRunning(Long recordId, Long distance, Duration runningTime, Long calories);
    List<RunningDTO.MainPageGroupResponse> mainPageGroups();
}
