package RunningMate.backend.domain.mainpage;

import RunningMate.backend.domain.community.dto.CommunityDTO;
import RunningMate.backend.domain.running.dto.RunningDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class MainPageDTO {
    List<CommunityDTO.MainPagePostResponse> mainPagePostList;
    List<RunningDTO.MainPageGroupResponse> mainPageGroupList;
}
