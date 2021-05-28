package ua.knu.restaurant.configuration;

import io.opentracing.Tracer;
import io.opentracing.util.GlobalTracer;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;

@Configuration
@RequiredArgsConstructor
@ConditionalOnProperty(value = "restaurant.tracing.sql.enabled")
public class TracingConfiguration {

    private final Tracer tracer;

    @PostConstruct
    private void postConstruct() {
        if (!GlobalTracer.isRegistered()) {
            GlobalTracer.register(tracer);
        }
    }
}
