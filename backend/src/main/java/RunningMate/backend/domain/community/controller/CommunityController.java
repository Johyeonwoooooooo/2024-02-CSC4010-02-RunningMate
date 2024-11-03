package RunningMate.backend.domain.community.controller;

import RunningMate.backend.domain.User.entity.User;
import RunningMate.backend.domain.authorization.SessionUtils;
import RunningMate.backend.domain.community.dto.CommunityDTO;
import RunningMate.backend.domain.community.entity.Post;
import RunningMate.backend.domain.community.service.CommunityService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

    @PostMapping(value = "/post/upload")
    public ResponseEntity<?> uploadPost(@RequestBody CommunityDTO.PostUploadRequest request,
                                        @RequestParam("image") List<MultipartFile> images,
                                        HttpSession session){
        Optional<User> optionalUser = sessionUtils.getUserFromSession(session);
        Post post = communityService.uploadPost(request, images, optionalUser);
        if (post==null)
            return ResponseEntity.badRequest().body("잘못됨");
        else
            return ResponseEntity.ok("등록완료");
    }
}
