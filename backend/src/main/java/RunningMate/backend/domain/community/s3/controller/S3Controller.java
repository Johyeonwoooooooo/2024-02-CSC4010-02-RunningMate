package RunningMate.backend.domain.community.s3.controller;

import RunningMate.backend.domain.community.s3.service.S3Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

// 테스트 용도입니다.  RequestMapping 제거후 community controller에서 service load하고 사용할거임.
@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/community/s3")
public class S3Controller {
    private final S3Service s3Service;
    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(@RequestParam("image") List<MultipartFile> images){
        return ResponseEntity.ok().body(s3Service.uploadFile(images));
    }
}
