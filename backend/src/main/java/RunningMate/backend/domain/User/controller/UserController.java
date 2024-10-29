package RunningMate.backend.domain.User.controller;

import RunningMate.backend.domain.User.dto.UserDTO;
import RunningMate.backend.domain.User.entity.User;
import RunningMate.backend.domain.User.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {
    private final UserService userService;

    @PostMapping("/signUp")
    @Operation(summary = "회원가입", description = "사용자에게 nickname, email, password, weight, height를 받아 회원가입을 진행한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "회원가입 성공"),
            @ApiResponse(responseCode = "400", description = "회원가입 실패")
    })
    public ResponseEntity<?> signUp(@RequestBody UserDTO.SignUpRequest request){ // 추후 response type, cookie or session 추가
        try {
            User user = userService.signUp(request);
            return ResponseEntity.ok().body(user.getUserNickname() + user.getUserEmail());
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/logIn")
    @Operation(summary = "로그인", description = "사용자에게 email, password를 받아 로그인을 진행한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "로그인 성공"),
            @ApiResponse(responseCode = "400", description = "로그인 실패")
    })
    public ResponseEntity<?> Login(@RequestBody  UserDTO.LoginRequest request){ // 추후 response type, cookie or session 추가
        try {
            User user = userService.logIn(request);
            return ResponseEntity.ok().body(user.getUserNickname() + user.getUserEmail());
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
