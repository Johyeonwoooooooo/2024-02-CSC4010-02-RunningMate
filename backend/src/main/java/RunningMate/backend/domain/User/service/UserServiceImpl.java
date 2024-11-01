package RunningMate.backend.domain.User.service;

import RunningMate.backend.domain.User.dto.UserDTO;
import RunningMate.backend.domain.User.entity.User;
import RunningMate.backend.domain.User.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{
    private final UserRepository userRepository;

    @Override
    public User signUp(UserDTO.SignUpRequest request) {
        if(userRepository.findUserByUserEmail(request.getUserEmail()).isPresent())
            throw new IllegalArgumentException("중복된 이메일");

        if(userRepository.findUserByUserNickname(request.getUserNickname()).isPresent())
            throw new IllegalArgumentException("중복된 닉네임");

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
