package RunningMate.backend.domain.running.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InitRunningServiceImpl implements ApplicationListener<ContextRefreshedEvent> {
    private final RunningService runningService;

    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        runningService.autoCreateQuickRunningGroup();
    }
}
