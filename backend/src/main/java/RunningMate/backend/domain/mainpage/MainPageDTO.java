package RunningMate.backend.domain.mainpage;

import RunningMate.backend.domain.community.dto.CommunityDTO;
import RunningMate.backend.domain.running.dto.RunningDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class MainPageDTO {
    List<CommunityDTO.MainPagePostResponse> mainPageRunningSpotPostList;
    List<CommunityDTO.MainPagePostResponse> mainPageRunningCertPostList;
    List<RunningDTO.MainPageGroupResponse> mainPageGroupList;

    public MainPageDTO(List<CommunityDTO.MainPagePostResponse> mainPagePosts,
                                List<RunningDTO.MainPageGroupResponse> mainPageGroups)
    {
        this.mainPageGroupList = mainPageGroups;
        this.mainPageRunningSpotPostList = new ArrayList<>();
        this.mainPageRunningCertPostList = new ArrayList<>();

        mainPagePosts.stream().forEach(post -> {
            if (post.getPostTag()) {
                this.mainPageRunningSpotPostList.add(post);
            } else {
                this.mainPageRunningCertPostList.add(post);
            }
        });
    }
}
