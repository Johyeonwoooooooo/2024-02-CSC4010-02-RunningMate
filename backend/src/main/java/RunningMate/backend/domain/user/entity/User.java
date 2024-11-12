package RunningMate.backend.domain.user.entity;

import RunningMate.backend.domain.community.entity.Comment;
import RunningMate.backend.domain.community.entity.Post;
import RunningMate.backend.domain.community.entity.PostLike;
import RunningMate.backend.domain.running.entity.Record;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import java.util.List;

@Entity
@Getter
@DynamicInsert
@DynamicUpdate
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(nullable = false)
    private String userNickname;

    @Column(nullable = false)
    private String userEmail;

    @Column(nullable = false)
    private String userPassword;

    @Column(nullable = false)
    private Long userWeight;

    @Column(nullable = false)
    private Long userHeight;

    @OneToMany(mappedBy="user")
    private List<Record> record;

    @OneToMany(mappedBy = "user")
    private List<Post> postList;

    @OneToMany(mappedBy = "user")
    private List<Comment> commentList;

    @OneToMany(mappedBy = "user")
    private List<PostLike> postLikeList;

    public void updateProfile(String userNickname, Long userWeight, Long userHeight){
        this.userNickname = userNickname;
        this.userWeight = userWeight;
        this.userHeight = userHeight;
    }
}
