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
    private Double calories;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="userId")
    private User user;

    @OneToOne(mappedBy = "record")
    private LeaderBoard leaderBoard;

    public void updateRecord(Long distance, Duration runningTime) {
        this.distance = distance;
        this.runningTime = runningTime;
        this.calories = calcCalories();
    }

    private Double calcCalories(){
        long seconds = runningTime.getSeconds();
        Double pace = (double) distance / seconds;
        Double met = 0.0;
        if (pace >= 4.03){
            met = 12.8;
        }else if(pace >= 3.58){
            met = 11.5;
        }else if(pace >= 3.13){
            met = 10.0;
        }else if(pace >= 2.70){
            met = 8.0;
        }else{
            met = 6.0;
        }

        return Math.round(met * this.user.getUserWeight() * (seconds / 3600.0) * 100) / 100.0;
    }
}
