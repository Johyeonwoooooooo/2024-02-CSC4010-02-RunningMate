package RunningMate.backend.domain.user.service;

import RunningMate.backend.domain.user.dto.UserDTO;
import RunningMate.backend.domain.user.entity.User;
import RunningMate.backend.domain.user.repository.UserRepository;
import RunningMate.backend.domain.community.entity.Post;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{
    private final UserRepository userRepository;

    @Override
    public User signUp(UserDTO.SignUpRequest request) {
        if(userRepository.findUserByUserEmail(request.getUserEmail()).isPresent())
            throw new IllegalArgumentException("중복된 이메일입니다.");

        if(userRepository.findUserByUserNickname(request.getUserNickname()).isPresent())
            throw new IllegalArgumentException("중복된 닉네임입니다.");

        User newUser = User.builder().userEmail(request.getUserEmail())
                .userNickname(request.getUserNickname())
                .userPassword(toSHA256(request.getUserPassword()))
                .userWeight(request.getUserWeight())
                .userHeight(request.getUserHeight())
                .build();

        userRepository.save(newUser);
        return newUser;
    }

    @Override
    public User logIn(UserDTO.LoginRequest request) {
        Optional<User> user = userRepository.findUserByUserEmailAndUserPassword(request.getUserEmail(), toSHA256(request.getUserPassword()));
        if (user.isEmpty())
            throw new IllegalArgumentException("사용자 정보를 찾을 수 없습니다.");

        return user.get();
    }

    @Override
    public UserDTO.GetProfileResponse profile(Optional<User> optionalUser) {
        if(optionalUser.isEmpty())
            throw new IllegalArgumentException("로그인이 필요한 서비스입니다.");

        User user = optionalUser.get();
        return UserDTO.GetProfileResponse.builder()
                        .userNickname(user.getUserNickname())
                        .userHeight(user.getUserHeight())
                        .userWeight(user.getUserWeight())
                        .build();
    }

    @Override
    public User updateProfile(UserDTO.UpdateProfileRequest request, Optional<User> optionalUser) {
        if (optionalUser.isEmpty())
            throw new IllegalArgumentException("로그인이 필요한 서비스입니다.");

        if (userRepository.findUserByUserNickname(request.getUserNickname()).isPresent())
            throw new IllegalArgumentException("중복된 닉네임입니다.");

        String userNickname = request.getUserNickname();
        Long userHeight = request.getUserHeight();
        Long userWeight = request.getUserWeight();

        User user = optionalUser.get();
        user.updateProfile(userNickname, userWeight, userHeight);
        return userRepository.save(user);
    }

    @Override
    public List<UserDTO.MyPostResponse> viewMyPost(Optional<User> user) {
        if (user.isEmpty()) {
            throw new IllegalArgumentException("로그인이 필요한 서비스입니다.");
        }

        List<Post> posts = user.get().getPostList();

        return posts.stream()
                .map(post -> {
                    List<String> postImages = post.getPostImageList()
                            .stream()
                            .map(image -> image.getImageURL()) // 이미지 URL 추출
                            .toList();
                    return UserDTO.MyPostResponse.builder()
                            .postId(post.getPostId())
                            .postTitle(post.getPostTitle())
                            .postContent(post.getPostContent())
                            .postDate(post.getPostDate())
                            .postImages(postImages) // 이미지 리스트 추가
                            .build();
                })
                .toList();

    }

    // 암호화 툴 : 비밀번호는 암호화한 후 데이터베이스에 삽입.
    private String toSHA256(String base) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(base.getBytes("UTF-8"));
            StringBuilder hexString = new StringBuilder();

            for (int i = 0; i < hash.length; i++) {
                String hex = Integer.toHexString(0xff & hash[i]);
                if(hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }

            return hexString.toString();
        } catch(NoSuchAlgorithmException | UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }
}
