package RunningMate.backend.DAO;

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
    private String userEmail;

    @Column(nullable = false)
    private String userPassword;

    @Column(nullable = false)
    private Long userWeight;

    @Column(nullable = false)
    private Long userHeight;

    @OneToMany(mappedBy="userId")
    private List<Record> record;

    @OneToMany(mappedBy = "userId")
    private List<Post> postList;

    @OneToMany(mappedBy = "userId")
    private List<Comment> commentList;

    @OneToMany(mappedBy = "userId")
    private List<Like> LikeList;
    public void updateProfile(Long userWeight, Long userHeight){
        this.userWeight=userWeight;
        this.userHeight=userHeight;
    }
}
