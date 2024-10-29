package RunningMate.backend.domain.community.entity;

import RunningMate.backend.domain.User.entity.User;
import RunningMate.backend.domain.community.entity.Post;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long commentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "postId")
    private Post post;

    @Column(nullable = false)
    private Date commentWriteTime;

    @Column(nullable = false)
    private String commentContent;
}
