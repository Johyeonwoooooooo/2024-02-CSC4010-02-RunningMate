package RunningMate.backend.domain.community.s3.service;

import RunningMate.backend.domain.community.entity.PostImage;
import RunningMate.backend.domain.community.repository.PostImageRepository;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class S3Service {
    private final AmazonS3 amazonS3;
    private final PostImageRepository imageRepository;
    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    public List<PostImage> uploadFile(List<MultipartFile> images) {
        try {
            List<PostImage> postImages = new ArrayList<>();
            for (MultipartFile image : images) {
                String fileName = image.getOriginalFilename();
                ObjectMetadata metadata = new ObjectMetadata();
                metadata.setContentType(image.getContentType());
                metadata.setContentLength(image.getSize());

                String key = (imageRepository.count()+1) + fileName; // id + file name을 키로 가짐 (file name 같은 경우 방지)
                URL url = amazonS3.getUrl(bucket, key);
                PostImage postImage = PostImage.builder()
                        .imageURL(url.toString())
                        .imageKey(key)
                        .build();

                amazonS3.putObject(bucket, key, image.getInputStream(), metadata);
                imageRepository.save(postImage);
                postImages.add(postImage);
            }
            return postImages;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
}
