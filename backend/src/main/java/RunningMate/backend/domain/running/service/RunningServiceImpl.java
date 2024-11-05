package RunningMate.backend.domain.running.service;

import RunningMate.backend.domain.User.entity.User;
import RunningMate.backend.domain.running.dto.RunningDTO;
import RunningMate.backend.domain.running.entity.LeaderBoard;
import RunningMate.backend.domain.running.entity.Record;
import RunningMate.backend.domain.running.entity.RunningGroup;
import RunningMate.backend.domain.running.repository.LeaderBoardRepository;
import RunningMate.backend.domain.running.repository.RecordRepository;
import RunningMate.backend.domain.running.repository.RunningGroupRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class RunningServiceImpl implements RunningService {
    private final RunningGroupRepository groupRepository;
    private final LeaderBoardRepository leaderBoardRepository;
    private final RecordRepository recordRepository;
    @Override
    public RunningGroup makeRunningGroup(RunningDTO.MakeRunningGroupRequest request, Optional<User> optionalUser) {
        if(optionalUser.isEmpty())
            return null;
        Record newRecord = Record.builder().user(optionalUser.get()).runningTime(0L).calories(0L).distance(0L).build();
        Record record = recordRepository.save(newRecord);

        RunningGroup newGroup = RunningGroup.builder().groupTitle(request.getGroupTitle())
                                                        .groupTag(request.getGroupTag())
                                                        .startTime(request.getStartTime())
                                                        .endTime(request.getEndTime())
                                                        .currentParticipants(0)
                                                        .maxParticipants(request.getMaxParticipants())
                                                        .targetDistance(request.getTargetDistance())
                                                        .build();

        RunningGroup group = groupRepository.save(newGroup);

        LeaderBoard build = LeaderBoard.builder().group(group).record(record).ranking(0L).build();
        leaderBoardRepository.save(build);
        return group;
    }

    @Override
    public List<RunningDTO.RunningGroupViewResponse> viewRunningGroups() {
        List<RunningGroup> groupList = groupRepository.findAllByStartTimeAfter(LocalDateTime.now());
        return groupList.stream().map(RunningDTO.RunningGroupViewResponse::new).toList();
    }
}
