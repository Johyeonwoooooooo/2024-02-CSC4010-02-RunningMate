package RunningMate.backend.domain.running.entity;

import RunningMate.backend.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import java.time.Duration;
import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@DynamicInsert
@DynamicUpdate
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Record {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long recordId;

    @Column(nullable = false)
    private Long distance;

    @Column(nullable = false)
    private LocalDate runningStartTime;

    @Column(nullable = false)
    private Duration runningTime;

    @Column(nullable = false)
    private Long calories;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="userId")
    private User user;

    @OneToOne(mappedBy = "record")
    private LeaderBoard leaderBoard;

    public void updateRecord(Long distance, Duration runningTime, Long calories) {
        this.distance = distance;
        this.runningTime = runningTime;
        this.calories = calories;
    }

}
