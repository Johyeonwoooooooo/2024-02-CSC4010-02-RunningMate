package RunningMate.backend.domain.mainpage;

import RunningMate.backend.domain.community.dto.CommunityDTO;
import RunningMate.backend.domain.community.service.CommunityService;
import RunningMate.backend.domain.running.dto.RunningDTO;
import RunningMate.backend.domain.running.service.RunningService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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

    @Operation(summary = "메인 페이지 요청", description = "메인 페이지에서 띄워줄 게시글, 개설된 러닝그룹을 반환한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "메인페이지 정보 반환 성공")
    })
    @GetMapping("")
    public ResponseEntity<?> getMainPage(){
        List<CommunityDTO.MainPagePostResponse> mainPagePost = communityService.getMainPagePost();
        List<RunningDTO.MainPageGroupResponse> mainPageGroupResponses = runningService.mainPageGroups();
        return ResponseEntity.ok().body(new MainPageDTO(mainPagePost, mainPageGroupResponses));
    }
}
