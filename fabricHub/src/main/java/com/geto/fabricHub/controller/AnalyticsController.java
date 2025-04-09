package com.geto.fabricHub.controller;

import com.geto.fabricHub.exception.UserException;
import com.geto.fabricHub.model.User;
import com.geto.fabricHub.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final UserService userService;

    public AnalyticsController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/user/stats")
    public ResponseEntity<Map<String, Object>> getUserStats(
            @CookieValue("jwtToken") String jwtToken) throws UserException {

        User user = userService.findUserProfileByJwt(jwtToken);
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalOrders", user.getOrders() != null ? user.getOrders().size() : 0);
        stats.put("totalAddresses", user.getAddress() != null ? user.getAddress().size() : 0);
        stats.put("accountAge", "Active since registration");
        stats.put("userId", user.getId());

        return new ResponseEntity<>(stats, HttpStatus.OK);
    }

    @GetMapping("/user/activity")
    public ResponseEntity<Map<String, Object>> getUserActivity(
            @CookieValue("jwtToken") String jwtToken) throws UserException {

        User user = userService.findUserProfileByJwt(jwtToken);
        Map<String, Object> activity = new HashMap<>();
        activity.put("lastLogin", "Recent");
        activity.put("totalSessions", 1);
        activity.put("preferredCategories", List.of("Fashion", "Clothing"));
        activity.put("averageOrderValue", "₹2500");

        return new ResponseEntity<>(activity, HttpStatus.OK);
    }

    @GetMapping("/system/health")
    public ResponseEntity<Map<String, Object>> getSystemHealth() {

        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("database", "Connected");
        health.put("uptime", "99.9%");
        health.put("activeUsers", 150);
        health.put("totalProducts", 500);

        return new ResponseEntity<>(health, HttpStatus.OK);
    }

    @GetMapping("/dashboard/overview")
    public ResponseEntity<Map<String, Object>> getDashboardOverview() {

        Map<String, Object> overview = new HashMap<>();
        overview.put("totalUsers", 1250);
        overview.put("totalOrders", 3400);
        overview.put("totalRevenue", "₹2,50,000");
        overview.put("topCategories", List.of("T-Shirts", "Jeans", "Sneakers"));
        overview.put("recentActivity", "High traffic in last 24h");

        return new ResponseEntity<>(overview, HttpStatus.OK);
    }

    @GetMapping("/trends/popular")
    public ResponseEntity<Map<String, Object>> getPopularTrends() {

        Map<String, Object> trends = new HashMap<>();
        trends.put("trendingProducts", List.of("Summer Collection", "Casual Wear", "Sports Wear"));
        trends.put("popularColors", List.of("Black", "White", "Blue"));
        trends.put("topBrands", List.of("Nike", "Adidas", "Puma"));
        trends.put("seasonalTrends", "Summer fashion is trending");

        return new ResponseEntity<>(trends, HttpStatus.OK);
    }

    @GetMapping("/reports/summary")
    public ResponseEntity<Map<String, Object>> getReportsSummary() {

        Map<String, Object> reports = new HashMap<>();
        reports.put("dailyOrders", 45);
        reports.put("weeklyRevenue", "₹15,000");
        reports.put("monthlyGrowth", "12%");
        reports.put("customerSatisfaction", "4.5/5");
        reports.put("inventoryStatus", "Well stocked");
        reports.put("lastUpdated", "2024-08-30");

        return new ResponseEntity<>(reports, HttpStatus.OK);
    }
}
