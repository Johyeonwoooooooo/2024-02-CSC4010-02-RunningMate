package RunningMate.backend.domain.running.controller;

import RunningMate.backend.domain.User.entity.User;
import RunningMate.backend.domain.authorization.SessionUtils;
import RunningMate.backend.domain.running.dto.RunningDTO;
import RunningMate.backend.domain.running.entity.LeaderBoard;
import RunningMate.backend.domain.running.entity.RunningGroup;
import RunningMate.backend.domain.running.repository.LeaderBoardRepository;
import RunningMate.backend.domain.running.repository.RunningGroupRepository;
import RunningMate.backend.domain.running.service.RunningService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/Running")
public class RunningController {
    private final RunningService runningService;
    private final SessionUtils sessionUtils;
    @PostMapping("/createGroup")
    public ResponseEntity<?> createGroup(@RequestBody RunningDTO.MakeRunningGroupRequest request, HttpSession session){
        try {
            Optional<User> optionalUser = sessionUtils.getUserFromSession(session);
            RunningGroup runningGroup = runningService.makeRunningGroup(request, optionalUser);
            return ResponseEntity.ok(runningService.participateGroup(runningGroup.getGroupId(), optionalUser));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/participate/{groupId}")
    public ResponseEntity<?> participateGroup(@PathVariable Long groupId, HttpSession session){
        try{
            Optional<User> optionalUser = sessionUtils.getUserFromSession(session);
            return ResponseEntity.ok(runningService.participateGroup(groupId, optionalUser));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/")
    public ResponseEntity<?> getTest(){
        return ResponseEntity.ok(runningService.viewRunningGroups());
    }


}
