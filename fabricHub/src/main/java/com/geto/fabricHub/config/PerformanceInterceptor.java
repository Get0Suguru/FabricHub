package com.geto.fabricHub.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

@Component                      // resp to run code before & after every api request
public class PerformanceInterceptor implements HandlerInterceptor {

    // vars (thread safe -> multi user make req so) to store metrics
    private final ConcurrentHashMap<String, EndpointMetrics> endpointMetrics = new ConcurrentHashMap<>();
    private final AtomicLong totalRequests = new AtomicLong(0);
    private final AtomicLong totalResponseTime = new AtomicLong(0);

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler){
        request.setAttribute("startTime", System.currentTimeMillis());      // setting new attribute
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex){
        long startTime = (Long) request.getAttribute("startTime");          // retriving the atribure from prehandle
        long duration = System.currentTimeMillis() - startTime;

        String endpoint = request.getMethod() + " " + request.getRequestURI();

        // Update global metrics            || after every api req completion
        totalRequests.incrementAndGet();
        totalResponseTime.addAndGet(duration);

        // Update endpoint-specific metrics         || here key is endpoint we made above
        endpointMetrics.computeIfAbsent(endpoint, k -> new EndpointMetrics()).addRequest(duration);

        // Log for monitoring (you can remove this in production)   || will get this in console for each api
        if (duration > 100) { // Log slow requests
            System.out.println("SLOW API: " + endpoint + " took " + duration + "ms");
        } else {
            System.out.println("API: " + endpoint + " took " + duration + "ms");
        }
    }

    // Inner class to store endpoint metrics        || here we are storing metrics for each unique endpoint
    private static class EndpointMetrics {
        private final AtomicInteger requestCount = new AtomicInteger(0);
        private final AtomicLong totalTime = new AtomicLong(0);
        private final AtomicInteger fastRequests = new AtomicInteger(0); // < 100ms

        public void addRequest(long duration) {
            requestCount.incrementAndGet();
            totalTime.addAndGet(duration);
            if (duration < 100) {
                fastRequests.incrementAndGet();
            }
        }

        public int getFastRequests() {
            return fastRequests.get();
        }
    }

    // Method to get performance statistics
    public PerformanceStats getPerformanceStats() {
        long requests = totalRequests.get();
        long totalTime = totalResponseTime.get();

        double averageResponseTime = requests > 0 ? (double) totalTime / requests : 0;

        // Calculate 95th percentile (simplified)
        long fastRequests = endpointMetrics.values().stream()
                .mapToLong(metrics -> metrics.getFastRequests())
                .sum();

        return new PerformanceStats(
                requests,
                averageResponseTime,
                fastRequests * 100.0 / Math.max(requests, 1), // Percentage of fast requests
                endpointMetrics.size()
        );
    }

    // Data class for performance statistics
    @Data
    @AllArgsConstructor
    public static class PerformanceStats {
        private final long totalRequests;
        private final double averageResponseTime;
        private final double fastRequestPercentage;
        private final int uniqueEndpoints;


        @Override
        public String toString() {
            return String.format(
                    "Performance Stats: %d requests, %.2fms avg response, %.1f%% under 100ms, %d endpoints",
                    totalRequests, averageResponseTime, fastRequestPercentage, uniqueEndpoints
            );
        }
    }


}


