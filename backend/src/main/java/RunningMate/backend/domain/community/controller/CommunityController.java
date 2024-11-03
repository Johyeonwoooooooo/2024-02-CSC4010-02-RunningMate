package RunningMate.backend.domain.community.controller;

import RunningMate.backend.domain.User.entity.User;
import RunningMate.backend.domain.authorization.SessionUtils;
import RunningMate.backend.domain.community.dto.CommunityDTO;
import RunningMate.backend.domain.community.entity.Post;
import RunningMate.backend.domain.community.service.CommunityService;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/community")
public class CommunityController {
    private final CommunityService communityService;
    private final SessionUtils sessionUtils;
    private final ObjectMapper objectMapper;

    @PostMapping(value = "/post/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "커뮤니티 글 작성", description = "사용자에게 postTitle, postTag, postContent를 받아 커뮤니티에 글을 등록한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "글 등록 성공"),
            @ApiResponse(responseCode = "400", description = "글 등록 실패")
    })
    public ResponseEntity<?> uploadPost(@RequestParam("request") String request,
                                        @RequestParam("image") List<MultipartFile> images,
                                        HttpSession session){
        try {
            // JSON 문자열을 DTO 객체로 변환
            CommunityDTO.PostUploadRequest postUploadRequest  = objectMapper.readValue(request, CommunityDTO.PostUploadRequest.class);

            Optional<User> optionalUser = sessionUtils.getUserFromSession(session);
            Post post = communityService.uploadPost(postUploadRequest, images, optionalUser);
            if (post == null) {
                return ResponseEntity.badRequest().body("post가 비었습니다.");
            } else {
                return ResponseEntity.ok("글 등록에 성공하였습니다.");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
