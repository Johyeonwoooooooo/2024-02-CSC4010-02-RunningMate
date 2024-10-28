package RunningMate.backend.DAO;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.springframework.security.core.parameters.P;

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
    private Long runningTime;

    @Column(nullable = false)
    private Long calories;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="userId")
    private User user;

    @OneToOne(mappedBy = "record")
    private LeaderBoard leaderBoard;

    public void updateRecord(Long distance, Long runningTime){
        this.distance = distance;
        this.runningTime = runningTime;
        this.calories = calcCalorie();
    }

    /**
     * MET 계수 (running pace)에 따라 달라짐
     * calories = MET * weight * time
     * @return calories
     */
    private Long calcCalorie(){
        return 0L;
    }
}
