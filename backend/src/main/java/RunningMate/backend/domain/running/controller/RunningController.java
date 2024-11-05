package RunningMate.backend.domain.running.controller;

import RunningMate.backend.domain.User.entity.User;
import RunningMate.backend.domain.authorization.SessionUtils;
import RunningMate.backend.domain.running.dto.RunningDTO;
import RunningMate.backend.domain.running.entity.LeaderBoard;
import RunningMate.backend.domain.running.repository.LeaderBoardRepository;
import RunningMate.backend.domain.running.repository.RunningGroupRepository;
import RunningMate.backend.domain.running.service.RunningService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
@Slf4j
public class RunningController {
    private final LeaderBoardRepository leaderBoardRepository;
    private final RunningGroupRepository runningGroupRepository;
    private final RunningService runningService;
    private final SessionUtils sessionUtils;
    @PostMapping("createTest")
    public ResponseEntity<?> test(@RequestBody RunningDTO.MakeRunningGroupRequest request, HttpSession session){
        Optional<User> optionalUser = sessionUtils.getUserFromSession(session);
        return ResponseEntity.ok(runningService.makeRunningGroup(request, optionalUser));
    }

    @GetMapping("getTest")
    public ResponseEntity<?> getTest(){
        return ResponseEntity.ok(runningService.viewRunningGroups());
    }
}
