package RunningMate.backend.domain.running.service;

import RunningMate.backend.domain.running.entity.*;
import RunningMate.backend.domain.running.entity.Record;
import RunningMate.backend.domain.user.entity.User;
import RunningMate.backend.domain.running.dto.RunningDTO;
import RunningMate.backend.domain.running.repository.LeaderBoardRepository;
import RunningMate.backend.domain.running.repository.RecordRepository;
import RunningMate.backend.domain.running.repository.RunningGroupRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
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
            throw new IllegalArgumentException("로그인이 필요한 서비스입니다.");

        if(request.getMaxParticipants().equals(0))
            throw new IllegalArgumentException("최대 참가자는 1명 이상 이어야 합니다.");

        return groupRepository.save(RunningGroup.builder().groupTitle(request.getGroupTitle())
                                                            .groupTag(request.getGroupTag())
                                                            .startTime(request.getStartTime())
                                                            .endTime(request.getEndTime())
                                                            .currentParticipants(0)
                                                            .maxParticipants(request.getMaxParticipants())
                                                            .targetDistance(request.getTargetDistance())
                                                            .activate(true)
                                                            .build());
    }

    @Override
    public RunningDTO.ParticipateGroupResponse participateGroup(Long groupId, Optional<User> optionalUser) {
        if(optionalUser.isEmpty())
            throw new IllegalArgumentException("로그인이 필요한 서비스입니다.");

        RunningGroup group = groupRepository.findByGroupId(groupId);

        if(group == null)
            throw new IllegalArgumentException("해당 러닝방을 찾을 수 없습니다.");

        if(!group.participateGroup())
            throw new IllegalArgumentException("최대 참가자를 달성하여 참가할 수 없습니다.");

        if(group.getActivate().equals(false))
            throw new IllegalArgumentException("해당 러닝방은 종료되었습니다.");

        boolean alreadyParticipated = leaderBoardRepository.existsByGroupAndRecordUser(group, optionalUser);
        if (alreadyParticipated)
            throw new IllegalArgumentException("이미 해당 러닝방에 참여하셨습니다.");
        
        groupRepository.save(group);
        Record record = recordRepository.save(Record.builder().user(optionalUser.get())
                .runningStartTime(LocalDate.now()).runningTime(Duration.ZERO).calories(0L).distance(0L).build());
        LeaderBoard leaderBoard = LeaderBoard.builder().group(group).record(record).ranking(0L).build();
        leaderBoardRepository.save(leaderBoard);

        return new RunningDTO.ParticipateGroupResponse(record);
    }

    @Override
    @Transactional
    public void cancelParticipation(RunningDTO.CancelParticipationRequest request) {
        RunningGroup group = groupRepository.findByGroupId(request.getGroupId());
        if(group == null)
            throw new IllegalArgumentException("해당 러닝방이 존재하지 않습니다.");
        Record record = recordRepository.findRecordByRecordId(request.getRecordId());
        if(group == null)
            throw new IllegalArgumentException("해당 기록이 존재하지 않습니다.");

        if(!group.leaveGroup())
            throw new IllegalArgumentException("이미 참가자가 없습니다.");
        leaderBoardRepository.deleteLeaderBoardByGroupAndRecord(group, record);
        recordRepository.deleteRecordByRecordId(request.getRecordId());
    }

    @Override
    public List<RunningDTO.RunningGroupViewResponse> viewRunningGroups() {
        List<RunningGroup> groupList = groupRepository.findAllByStartTimeAfter(LocalDateTime.now());
        return groupList.stream().map(RunningDTO.RunningGroupViewResponse::new).toList();
    }

    @Override
    public List<RunningDTO.RunningGroupViewResponse> filteringGroup(GroupTag groupTag, String searchWord) {
        List<RunningGroup> groupList;
        if(groupTag == null){
            groupList = groupRepository.findAllByGroupTitleContainsAndStartTimeAfter(searchWord, LocalDateTime.now());
        }
        else {
            groupList = groupRepository.findAllByGroupTagAndGroupTitleContainsAndStartTimeAfter(groupTag, searchWord, LocalDateTime.now());
        }

        return groupList.stream().map(RunningDTO.RunningGroupViewResponse::new).toList();
    }

    @Override
    public RunningDTO.groupParticipantResponse groupParticipants(Long groupId) {
        RunningGroup group = groupRepository.findByGroupId(groupId);
        if(group == null)
            throw new IllegalArgumentException("해당 러닝방이 존재하지 않습니다.");

        if(group.getActivate().equals(false))
            throw new IllegalArgumentException("해당 러닝방은 종료되었습니다.");

        List<LeaderBoard> groups = leaderBoardRepository.findAllByGroup(group);
        List<String> participants = new ArrayList<>();
        for (LeaderBoard leaderBoard : groups) {
            participants.add(leaderBoard.getRecord().getUser().getUserNickname());
        }

        return RunningDTO.groupParticipantResponse.builder().groupTitle(group.getGroupTitle())
                .groupTag(group.getGroupTag()).endTime(group.getEndTime()).startTime(group.getStartTime())
                .currentParticipants(group.getCurrentParticipants()).maxParticipants(group.getMaxParticipants())
                .participants(participants).targetDistance(group.getTargetDistance()).build();
    }

    @Scheduled(cron="0 0 0 * * *") // 매일 자정에 자동으로 실행됨
    @Override
    public void autoCreateQuickRunningGroup() {
        // QUICK 이고 활성화된 방을 모두 비활성화
        List<RunningGroup> groups = groupRepository.findAllByGroupTagAndActivate(GroupTag.QUICK, true);
        for (RunningGroup group : groups) {
            group.deactivate();
            groupRepository.save(group);
        }
        // 새로 방 생성
        groupRepository.save(RunningGroup.builder()
                            .groupTitle("빠른 매칭방")
                            .groupTag(GroupTag.QUICK)
                            .startTime(LocalDateTime.now())
                            .endTime(LocalDateTime.now().plusDays(1))
                            .currentParticipants(0)
                            .maxParticipants(Integer.MAX_VALUE)
                            .targetDistance(Long.MAX_VALUE)
                             .activate(true)
                            .build());
    }

    @Override
    public RunningDTO.ParticipateQuickRunningResponse participateQuickRunning(Optional<User> optionalUser) {
        if(optionalUser.isEmpty())
            throw new IllegalArgumentException("로그인이 필요한 서비스입니다.");

        RunningGroup group = groupRepository.findByGroupTagAndActivate(GroupTag.QUICK, true);
        if(group == null)
            throw new IllegalArgumentException("생성되어 있는 빠른 러닝방이 없습니다.");

        Record record = recordRepository.findByUserAndLeaderBoardGroup(optionalUser, group);

        if (record == null){
            record = recordRepository.save(Record.builder().user(optionalUser.get())
                .runningStartTime(LocalDate.now()).runningTime(Duration.ZERO).calories(0L).distance(0L).build());

            LeaderBoard leaderBoard = LeaderBoard.builder().group(group).record(record).ranking(leaderBoardRepository.count() + 1).build();
            leaderBoardRepository.save(leaderBoard);

            group.participateGroup();
            groupRepository.save(group);
        }
        return new RunningDTO.ParticipateQuickRunningResponse(record);
    }

    @Override
    @Scheduled(fixedRate = 5000) // 5초마다 반복. 60000 = 1분
    public void deactivateRunningGroup() {
        List<RunningGroup> runningGroups = groupRepository.findAllByEndTimeBefore(LocalDateTime.now());
        for (RunningGroup runningGroup : runningGroups) {
            runningGroup.deactivate();
            groupRepository.save(runningGroup);
        }
    }

//    @Override
//    @Scheduled(fixedRate = 1000)
//    @Transactional
//    public void autoDeleteRunningGroup() {
//        groupRepository.deleteAllByEndTimeBefore(LocalDateTime.now().plusDays(1));
//    }

    @Override
    @Transactional
    public RunningDTO.WhileRunningResponse whileRunning(RunningDTO.WhileRunningRequest request, Optional<User> optionalUser) {
        if(optionalUser.isEmpty())
            throw new IllegalArgumentException("로그인이 필요한 서비스 입니다.");

        Record record = recordRepository.findById(request.getRecordId())
                .orElseThrow(() -> new IllegalArgumentException("해당 기록을 찾을 수 없습니다."));

        LeaderBoard userLeaderboard = leaderBoardRepository.findLeaderBoardByRecord(record);
        if(userLeaderboard==null)
            throw new IllegalArgumentException("해당하는 리더보드를 찾을 수 없습니다.");

        Long pre_ranking = userLeaderboard.getRanking();
        RunningGroup group = userLeaderboard.getGroup();

        record.updateRecord(request.getDistance(), request.getRunningTime(), request.getCalories());
        recordRepository.save(record);

        List<LeaderBoard> newLeaderboard = sortByDistance(leaderBoardRepository.findAllByGroup(group));

        Record newRecord = recordRepository.findRecordByRecordId(request.getRecordId());
        Long new_rank = leaderBoardRepository.findLeaderBoardByRecord(newRecord).getRanking();
        String rankChange = compareRanking(pre_ranking, new_rank);
        String TTSMessage = generateTTSMessage(rankChange, new_rank, request.getDistance(), newLeaderboard, optionalUser);
        return whileRunningResponse(newLeaderboard, new_rank, rankChange, TTSMessage);
    }

    private String generateTTSMessage(String rankChange, Long new_rank, Long currentDistance,
                                         List<LeaderBoard> newLeaderboard, Optional<User> optionalUser){
        List<Record> recordList = optionalUser.get().getRecord();
        Long userBestRecord = -1L;
        for (Record record : recordList) {
            if(record.getDistance() > userBestRecord)
                userBestRecord = record.getDistance();
        }

        if (currentDistance > userBestRecord) {
            return "현재 러닝 최고 기록 갱신 중 입니다. 현재 " + currentDistance + "미터 입니다.";
        }

        if(rankChange.equals("up")) {
            int userIndex = new_rank.intValue()-1;
            Long userDistance = newLeaderboard.get(userIndex).getRecord().getDistance();
            if(userIndex == 0) {
                return "현재" + userDistance + "미터로 1등 입니다! 선두를 유지하세요.";
            }
            Long leadingDistance = newLeaderboard.get(userIndex - 1).getRecord().getDistance();
            long distanceGap = userDistance - leadingDistance;
            return new_rank + "등이 되었습니다. " + (new_rank - 1) + "등과 " + distanceGap + "미터 차이 입니다.";
        }
        return "";
    }
    private List<LeaderBoard> sortByDistance(List<LeaderBoard> records){
        records.sort((o1, o2) -> Double.compare(o2.getRecord().getDistance(), o1.getRecord().getDistance()));
        for(int i = 1; i<= records.size(); i++){
            records.get(i-1).updateRanking(Long.valueOf(i));
        }
        return leaderBoardRepository.saveAll(records);
    }
    private String compareRanking(Long pre_rank, Long new_rank){
        if(pre_rank > new_rank)
            return "up";
        else if(pre_rank < new_rank)
            return "down";
        else
            return "same";
    }

    private RunningDTO.WhileRunningResponse whileRunningResponse(List<LeaderBoard> newLeaderboard, Long new_rank, String rankChange, String ttsMessage){
        List<RunningDTO.WhileRunningLeaderboardResponse> response = new ArrayList<>();
        int tail = newLeaderboard.size();
        if(newLeaderboard.size() < 3) { 
            // 참가 인원 3명이하일 때, 기존 리더보드 + 더미데이터 추가
            for (LeaderBoard leaderBoard : newLeaderboard) {
                response.add(new RunningDTO.WhileRunningLeaderboardResponse(leaderBoard, new_rank, rankChange));
            }

            for (int i = 1; i <= 3 - newLeaderboard.size(); i++) {
                response.add(new RunningDTO.WhileRunningLeaderboardResponse("-", Long.valueOf(tail + i), false, "same"));
            }
        }
        else{
            // 3명 이상일때
            if(new_rank.equals(1L)){ // 1등이면 1,2,3등
                for (LeaderBoard leaderBoard : newLeaderboard.subList(0, 3)) {
                    response.add(new RunningDTO.WhileRunningLeaderboardResponse(leaderBoard, new_rank, rankChange));
                }
            }
            else if(new_rank.equals(newLeaderboard.size())){ // 꼴등이면 뒤에서 3, 2, 1등
                for (LeaderBoard leaderBoard : newLeaderboard.subList(tail-3, tail)){
                    response.add(new RunningDTO.WhileRunningLeaderboardResponse(leaderBoard, new_rank, rankChange));
                }
            }
            else{ // 나머진 위 나 아래
                int index = new_rank.intValue() - 1;
                response.add(new RunningDTO.WhileRunningLeaderboardResponse(newLeaderboard.get(index-1), new_rank, rankChange));
                response.add(new RunningDTO.WhileRunningLeaderboardResponse(newLeaderboard.get(index), new_rank, rankChange));
                response.add(new RunningDTO.WhileRunningLeaderboardResponse(newLeaderboard.get(index+1), new_rank, rankChange));
            }
        }
        return RunningDTO.WhileRunningResponse.builder().leaderboardResponseList(response).ttsMessage(ttsMessage).build();
    }
    @Override
    public List<RunningDTO.LeaderboardResponse> leaderboard(Long recordId, Optional<User> optionalUser) {
        if(optionalUser.isEmpty())
            throw new IllegalArgumentException("로그인이 필요한 서비스입니다.");

        Record record = recordRepository.findRecordByRecordId(recordId);
        if(record == null)
            throw new IllegalArgumentException("해당 리더보드를 찾을 수 없습니다.");

        RunningGroup group = leaderBoardRepository.findLeaderBoardByRecord(record).getGroup();
        if(group == null)
            throw new IllegalArgumentException("해당 리더보드를 찾을 수 없습니다.");

        List<LeaderBoard> allRecord = leaderBoardRepository.findAllByGroupOrderByRankingAsc(group);
        if(allRecord.isEmpty())
            throw new IllegalArgumentException("해당 러닝방에 참가한 기록이 없습니다.");

        List<RunningDTO.LeaderboardResponse> leaderboardResponses = new ArrayList<>();
        for (LeaderBoard leaderBoard : allRecord) {
            boolean yourRecord = false;
            if(leaderBoard.getRecord().getUser().equals(optionalUser.get())) yourRecord = true;
            leaderboardResponses.add(new RunningDTO.LeaderboardResponse(leaderBoard, yourRecord));
        }
        return leaderboardResponses;
    }

    @Override
    public List<RunningDTO.MainPageGroupResponse> mainPageGroups() {
        List<RunningGroup> groupList = groupRepository.findAllByStartTimeAfter(LocalDateTime.now());
        return groupList.stream().limit(6).map(RunningDTO.MainPageGroupResponse::new).toList();
    }
}
