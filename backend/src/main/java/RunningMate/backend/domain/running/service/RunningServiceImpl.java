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
import java.util.Comparator;
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
        Long ranking = Long.valueOf(leaderBoardRepository.findAllByGroup(group).size()) + 1;

        Record record = recordRepository.save(Record.builder().user(optionalUser.get())
                .runningStartTime(LocalDate.now()).runningTime(Duration.ZERO).calories(0.0).distance(0L).build());
        LeaderBoard leaderBoard = LeaderBoard.builder().group(group).record(record).currentRanking(ranking).preRanking(ranking).build();
        leaderBoardRepository.save(leaderBoard);

        return new RunningDTO.ParticipateGroupResponse(record);
    }

    @Override
    @Transactional
    public void cancelParticipation(Long recordId) {
        Record record = recordRepository.findRecordByRecordId(recordId);
        LeaderBoard userLeaderboard = leaderBoardRepository.findLeaderBoardByRecord(record);
        RunningGroup group = userLeaderboard.getGroup();
        if(group == null)
            throw new IllegalArgumentException("해당 러닝방이 존재하지 않습니다.");
        if(group == null)
            throw new IllegalArgumentException("해당 기록이 존재하지 않습니다.");

        if(!group.leaveGroup())
            throw new IllegalArgumentException("이미 참가자가 없습니다.");
        leaderBoardRepository.deleteLeaderBoardByGroupAndRecord(group, record);
        recordRepository.deleteRecordByRecordId(recordId);
    }

    @Override
    public List<RunningDTO.RunningGroupViewResponse> viewRunningGroups() {
        List<RunningGroup> groupList = groupRepository.findAllByActivateTrueAndGroupTagNot(GroupTag.QUICK);
        return groupList.stream().map(RunningDTO.RunningGroupViewResponse::new).toList();
    }

    @Override
    public List<RunningDTO.RunningGroupViewResponse> filteringGroup(GroupTag groupTag, String searchWord) {
        List<RunningGroup> groupList;
        if(groupTag == null){
            groupList = groupRepository.findAllByGroupTitleContainsAndActivateTrue(searchWord);
        }
        else {
            groupList = groupRepository.findAllByGroupTagAndGroupTitleContainsAndActivateTrue(groupTag, searchWord);
        }

        return groupList.stream().map(RunningDTO.RunningGroupViewResponse::new).toList();
    }

    @Override
    public RunningDTO.groupParticipantResponse groupParticipants(Long recordId) {
        Record record = recordRepository.findRecordByRecordId(recordId);
        LeaderBoard userLeaderboard = leaderBoardRepository.findLeaderBoardByRecord(record);
        RunningGroup group = userLeaderboard.getGroup();

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
        List<RunningGroup> groups = groupRepository.findAllByGroupTagAndActivateTrue(GroupTag.QUICK);
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

        RunningGroup group = groupRepository.findByGroupTagAndActivateTrue(GroupTag.QUICK);
        if(group == null)
            throw new IllegalArgumentException("생성되어 있는 빠른 러닝방이 없습니다.");

        Record record = recordRepository.findByUserAndLeaderBoardGroup(optionalUser, group);

        if (record == null){
            record = recordRepository.save(Record.builder().user(optionalUser.get())
                .runningStartTime(LocalDate.now()).runningTime(Duration.ZERO).calories(0.0).distance(0L).build());

            Long ranking = Long.valueOf(leaderBoardRepository.findAllByGroup(group).size() + 1);
            LeaderBoard leaderBoard = LeaderBoard.builder().group(group).record(record).currentRanking(ranking).preRanking(ranking).build();
            leaderBoardRepository.save(leaderBoard);

            group.participateGroup();
            groupRepository.save(group);
        }
        return new RunningDTO.ParticipateQuickRunningResponse(record);
    }

    @Override
    @Scheduled(fixedRate = 5000) // 5초마다 반복. 60000 = 1분
    public void deactivateRunningGroup() {
        List<RunningGroup> runningGroups = groupRepository.findAllByEndTimeBeforeAndActivateTrue(LocalDateTime.now());
        for (RunningGroup runningGroup : runningGroups) {
            runningGroup.deactivate();
            groupRepository.save(runningGroup);
        }
    }

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

        RunningGroup group = userLeaderboard.getGroup();

        record.updateRecord(request.getDistance(), request.getRunningTime());
        recordRepository.save(record);

        List<LeaderBoard> newLeaderboard = sortByDistance(leaderBoardRepository.findAllByGroup(group));

        String rankChange = compareRanking(userLeaderboard);
        Long new_rank = leaderBoardRepository.findLeaderBoardByRecord(record).getCurrentRanking();
        return whileRunningResponse(newLeaderboard, new_rank, rankChange);
    }


    public String generateTTSMessage(Long recordId, Optional<User> optionalUser){
        Record record = recordRepository.findRecordByRecordId(recordId);
        LeaderBoard userLeaderBoard = leaderBoardRepository.findLeaderBoardByRecord(record);
        List<LeaderBoard> newLeaderboard = leaderBoardRepository.findAllByGroup(userLeaderBoard.getGroup());
        List<Record> records = new ArrayList<>();
        for (LeaderBoard leaderBoard : newLeaderboard) {
            records.add(leaderBoard.getRecord());
        }
        records.sort((r1, r2) -> Double.compare(r2.getDistance(), r1.getDistance()));

        String rankChange = compareRanking(userLeaderBoard);
        Long currentDistance = record.getDistance();
        Long new_rank = userLeaderBoard.getCurrentRanking();

        Long userBestRecord = 0L;
        Record bestRecord = recordRepository.findRecordByUserOrderByDistanceDesc(optionalUser.get()).get(0);

        if(bestRecord != null)
            userBestRecord = bestRecord.getDistance();

        if (currentDistance >= userBestRecord) {
            return "현재 러닝 최고 기록 갱신 중 입니다. 현재 " + currentDistance + "미터 입니다.";
        }

        if(rankChange.equals("up")) {
            int userIndex = new_rank.intValue()-1;
            Long userDistance = records.get(userIndex).getDistance();
            if(userIndex == 0) {
                return "현재 " + userDistance + "미터로 1등이 되었습니다! 선두를 유지하세요.";
            }
            Long leadingDistance = records.get(userIndex - 1).getDistance();
            long distanceGap = leadingDistance - userDistance;
            return new_rank + "등이 되었습니다. " + (new_rank - 1) + "등과 " + distanceGap + "미터 차이 입니다.";
        }
        else if(rankChange.equals("same")){
            int userIndex = new_rank.intValue()-1;
            Long userDistance = records.get(userIndex).getDistance();
            if(userIndex == 0){
                if(newLeaderboard.size() > 1)
                    return "현재 1등으로 선두입니다. 2등과는 " + (userDistance - records.get(userIndex + 1).getDistance()) + "미터 차이입니다.";
                else
                    return "현재 1등으로 선두입니다.";
            }
            else{
                return "현재 " + new_rank + "등 입니다. " + (new_rank-1) + "등과는 " + (records.get(userIndex - 1).getDistance() - userDistance) + "미터 차이입니다.";
            }
        }
        else{
            return "현재 " + new_rank + "등이 되었습니다.";
        }
    }
    private List<LeaderBoard> sortByDistance(List<LeaderBoard> records){
        if (!records.isEmpty()) {
            records.sort(Comparator.comparing((LeaderBoard r) -> r.getRecord().getDistance()).reversed());
        }
        for(int i = 1; i<= records.size(); i++){
            records.get(i-1).updateRanking(Long.valueOf(i));
        }
        return leaderBoardRepository.saveAll(records);
    }
    private String compareRanking(LeaderBoard leaderBoard){
        if(leaderBoard.getPreRanking() > leaderBoard.getCurrentRanking())
            return "up";
        else if(leaderBoard.getPreRanking() < leaderBoard.getCurrentRanking())
            return "down";
        else
            return "same";
    }

    private RunningDTO.WhileRunningResponse whileRunningResponse(List<LeaderBoard> newLeaderboard, Long new_rank, String rankChange){
        List<RunningDTO.WhileRunningLeaderboardResponse> response = new ArrayList<>();
        int tail = newLeaderboard.size();
        if(newLeaderboard.size() < 3) { 
            // 참가 인원 3명이하일 때, 기존 리더보드 + 더미데이터 추가
            for (LeaderBoard leaderBoard : newLeaderboard) {
                response.add(new RunningDTO.WhileRunningLeaderboardResponse(leaderBoard, new_rank, rankChange));
            }

            for (int i = 1; i <= 3 - newLeaderboard.size(); i++) {
                response.add(new RunningDTO.WhileRunningLeaderboardResponse("-", Long.valueOf(tail + i), false, "same", 0.0));
            }
        }
        else{
            // 3명 이상일때
            if(new_rank.equals(1L)){ // 1등이면 1,2,3등
                for (LeaderBoard leaderBoard : newLeaderboard.subList(0, 3)) {
                    response.add(new RunningDTO.WhileRunningLeaderboardResponse(leaderBoard, new_rank, rankChange));
                }
            }
            else if(new_rank.intValue() ==  newLeaderboard.size()){ // 꼴등이면 뒤에서 3, 2, 1등
                for (LeaderBoard leaderBoard : newLeaderboard.subList(tail-3, tail)){
                    response.add(new RunningDTO.WhileRunningLeaderboardResponse(leaderBoard, new_rank, rankChange));
                }
            }
            else{ // 나머진 위 나 아래
                int index = new_rank.intValue() - 1;
                response.add(new RunningDTO.WhileRunningLeaderboardResponse(newLeaderboard.get(index-1), new_rank-1, "same"));
                response.add(new RunningDTO.WhileRunningLeaderboardResponse(newLeaderboard.get(index), new_rank, rankChange));
                response.add(new RunningDTO.WhileRunningLeaderboardResponse(newLeaderboard.get(index+1), new_rank+1, "same"));
            }
        }
        return RunningDTO.WhileRunningResponse.builder().leaderboardResponseList(response).build();
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

        List<LeaderBoard> allRecord = leaderBoardRepository.findAllByGroupOrderByCurrentRankingAsc(group);
        if(allRecord.isEmpty())
            throw new IllegalArgumentException("해당 러닝방에 참가한 기록이 없습니다.");

        List<RunningDTO.LeaderboardResponse> leaderboardResponses = new ArrayList<>();
        for (LeaderBoard leaderBoard : allRecord) {
            boolean yourRecord = false;
            if(leaderBoard.getRecord().getUser().equals(optionalUser.get())) yourRecord = true;
            leaderboardResponses.add(new RunningDTO.LeaderboardResponse(leaderBoard, yourRecord));
        }

        int size = leaderboardResponses.size();
        if(size < 3){
            for(int i = 0; i < 3- size; i++){
                leaderboardResponses.add(new RunningDTO.LeaderboardResponse(Long.valueOf(size+1+i), "-", false,  0L));
            }
        }
        return leaderboardResponses;
    }

    @Override
    public List<RunningDTO.MainPageGroupResponse> mainPageGroups() {
        List<RunningGroup> groupList = groupRepository.findAllByActivateTrueAndGroupTagNot(GroupTag.QUICK);
        return groupList.stream().limit(6).map(RunningDTO.MainPageGroupResponse::new).toList();
    }
}
