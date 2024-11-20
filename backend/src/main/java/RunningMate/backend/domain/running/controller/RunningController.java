package RunningMate.backend.domain.running.controller;

import RunningMate.backend.domain.user.entity.User;
import RunningMate.backend.domain.authorization.SessionUtils;
import RunningMate.backend.domain.running.dto.RunningDTO;
import RunningMate.backend.domain.running.entity.GroupTag;
import RunningMate.backend.domain.running.entity.LeaderBoard;
import RunningMate.backend.domain.running.entity.RunningGroup;
import RunningMate.backend.domain.running.repository.LeaderBoardRepository;
import RunningMate.backend.domain.running.repository.RunningGroupRepository;
import RunningMate.backend.domain.running.service.RunningService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/running")
public class RunningController {
    private final RunningService runningService;
    private final SessionUtils sessionUtils;
    @PostMapping("/create")
    @Operation(summary = "러닝방 생성하기", description = "사용자에게 제목, 태그, 시작,종료시간, 참가수, 목표러닝거리를 받아 러닝방을 생성한다." +
                                                        "\n 사용자는 러닝 방 생성 동시에 러닝방에 참가하게 되고 record에 대한 정보를 리턴한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "러닝 방 생성 완료"),
            @ApiResponse(responseCode = "400", description = "러닝 방 생성 실패")
    })
    public ResponseEntity<?> createGroup(@RequestBody RunningDTO.MakeRunningGroupRequest request, HttpSession session){
        try {
            Optional<User> optionalUser = sessionUtils.getUserFromSession(session);
            RunningGroup runningGroup = runningService.makeRunningGroup(request, optionalUser);
            return ResponseEntity.ok(runningService.participateGroup(runningGroup.getGroupId(), optionalUser));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "러닝방 참가하기", description = "사용자에게 참가하고 싶은 groupId를 받아 러닝방에 참가시킨다."+
                                                         "\n 사용자는 러닝방에 참가시키고 record 정보를 리턴한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "러닝 방 참가 성공"),
            @ApiResponse(responseCode = "400", description = "러닝 방 참가 실패")
    })
    @PostMapping("/{groupId}/participate")
    public ResponseEntity<?> participateGroup(@PathVariable("groupId") Long groupId, HttpSession session){
        try{
            Optional<User> optionalUser = sessionUtils.getUserFromSession(session);
            return ResponseEntity.ok(runningService.participateGroup(groupId, optionalUser));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "러닝 참가 취소", description = "recordId, groupId를 보내 러닝 참가를 취소 한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "참가 취소 성공"),
            @ApiResponse(responseCode = "400", description = "참가 취소 실패")
    })
    @DeleteMapping("/cancel")
    public ResponseEntity<?> cancelParticipation(@RequestBody RunningDTO.CancelParticipationRequest request){
        try{
            runningService.cancelParticipation(request);
            return ResponseEntity.ok().body("정상적으로 참가취소되었습니다.");
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "빠른 매칭 참가하기", description = "사용자를 빠른 매칭 러닝방에 참가시키고 record 정보를 리턴한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "빠른 매칭 참가 성공"),
            @ApiResponse(responseCode = "400", description = "빠른 매칭 참가 실패")
    })
    @PostMapping("/quickrunning/participate")
    public ResponseEntity<?> participateQuickRunning(HttpSession session) {
        try {
            Optional<User> optionalUser = sessionUtils.getUserFromSession(session);
            return ResponseEntity.ok(runningService.participateQuickRunning(optionalUser));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "러닝방 목록 조회하기", description = "사용자에게 러닝방 목록을 보여준다")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "러닝 방 조회 성공"),
            @ApiResponse(responseCode = "204", description = "생성된 러닝방이 없는 경우")
    })
    @GetMapping("")
    public ResponseEntity<?> viewRunningGroup(){
        List<RunningDTO.RunningGroupViewResponse> runningGroupViewResponses = runningService.viewRunningGroups();
        if (runningGroupViewResponses.isEmpty())
            return ResponseEntity.noContent().build();
        else
            return ResponseEntity.ok().body(runningGroupViewResponses);
    }

    @Operation(summary = "러닝방 목록 필터링하여 조회 하기", description = "사용자에게 groupTag, 검색어를 입력받아 필터링 후 결과를 반환한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "러닝 방 조회 성공"),
            @ApiResponse(responseCode = "204", description = "생성된 러닝방이 없는 경우")
    })

    @GetMapping("/filtering")
    public ResponseEntity<?> filteringRunningGroup(@RequestParam(value = "groupTag", required = false)GroupTag groupTag,
                                                   @RequestParam(value = "searchWord", defaultValue = "") String searchWord){
        List<RunningDTO.RunningGroupViewResponse> runningGroupViewResponses = runningService.filteringGroup(groupTag, searchWord);
        if (runningGroupViewResponses.isEmpty())
            return ResponseEntity.noContent().build();
        else
            return ResponseEntity.ok().body(runningGroupViewResponses);
    }

    @Operation(summary = "러닝방 참가자 조회 하기", description = "groupID를 보내 해당 러닝방에 참가 중인 유저들을 보여준다")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "참가자 조회 성공"),
            @ApiResponse(responseCode = "400", description = "생성된 러닝방이 없는 경우")
    })
    @GetMapping("/{groupId}/participants")
    public ResponseEntity<?> viewParticipants(@PathVariable("groupId") Long groupId){
        try{
            return ResponseEntity.ok().body(runningService.groupParticipants(groupId));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "러닝 중", description = "recordId, distance, runningTime, calories를 보내 러닝 정보를 저장한다. \n" +
            "{\n" +
            "  \"recordId\": 1,\n" +
            "  \"runningTime\": \"PT1H3M4S\",\n" +
            "  \"calories\": 100,\n" +
            "  \"distance\": 5\n" +
            "}")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "러닝 정보 저장 성공"),
            @ApiResponse(responseCode = "400", description = "러닝 정보 저장 실패")
    })
    @PostMapping("/update")
    public ResponseEntity<?> whileRunning(@RequestBody RunningDTO.WhileRunningRequest request, HttpSession session) {
        try {
            Optional<User> optionalUser = sessionUtils.getUserFromSession(session);
            return ResponseEntity.ok().body(runningService.whileRunning(request, optionalUser));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "리더보드", description = "recordId를 입력받아 리더보드를 제공한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "리더보드 조회 성공"),
            @ApiResponse(responseCode = "400", description = "리더보드 조회 실패 ")
    })
    @GetMapping("/leaderboard")
    public ResponseEntity<?> leaderboard(@RequestParam Long recordId, HttpSession session) {
        Optional<User> optionalUser = sessionUtils.getUserFromSession(session);
        try {
            return ResponseEntity.ok().body(runningService.leaderboard(recordId, optionalUser));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
