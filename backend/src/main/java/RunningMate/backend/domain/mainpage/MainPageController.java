package RunningMate.backend.domain.mainpage;

import RunningMate.backend.domain.community.dto.CommunityDTO;
import RunningMate.backend.domain.community.service.CommunityService;
import RunningMate.backend.domain.running.dto.RunningDTO;
import RunningMate.backend.domain.running.service.RunningService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/mainPage")
public class MainPageController {
    private final CommunityService communityService;
    private final RunningService runningService;

    @GetMapping("")
    public ResponseEntity<?> getMainPage(){
        List<CommunityDTO.MainPagePostResponse> mainPagePost = communityService.getMainPagePost();
        List<RunningDTO.MainPageGroupResponse> mainPageGroupResponses = runningService.mainPageGroups();
        return ResponseEntity.ok().body(MainPageDTO.builder().mainPageGroupList(mainPageGroupResponses).mainPagePostList(mainPagePost).build());
    }
}
