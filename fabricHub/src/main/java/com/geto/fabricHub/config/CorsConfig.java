package com.geto.fabricHub.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Value("${frontend.url}")
    private String frontendUrl;

    @Bean
    public WebMvcConfigurer corsConfigurer(){
        return new WebMvcConfigurer() {

            @Override
            public void addCorsMappings(CorsRegistry registry){
                registry.addMapping("/**")                       //now ab sare end points pe cors enabled hai
                        .allowedOrigins(frontendUrl, "http://localhost:5173")// kon kon se url allowed (basically ur fontend)
                        .allowedMethods("*")                             // GET", "POST", "PUT", "DELETE", "OPTIONS
                        .allowedHeaders("*")                             // head of html remember
                        .allowCredentials(true)                          // allow frontend to send authentication credentials
                        .exposedHeaders("Set-Cookie");                // that hidden headers are now ->  visible to our frontend
//                        .maxAge(3600);                                   // till that time u can rem the preflight req's -> response
            }
        };
    }
}
