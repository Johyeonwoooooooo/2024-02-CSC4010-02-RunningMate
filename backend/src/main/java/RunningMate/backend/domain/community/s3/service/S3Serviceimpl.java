package RunningMate.backend.domain.community.s3.service;

import com.amazonaws.services.s3.AmazonS3;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
//https://github.com/Like-House/BE/blob/develop/src/main/java/backend/like_house/global/s3/service/S3Service.java
@Service
@RequiredArgsConstructor
public class S3Serviceimpl {
    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

}
