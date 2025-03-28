package com.geto.fabricHub.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customConfig(){
        return new OpenAPI()
                .info(
                        new Info().description("by geto").title("fabricHub's api doc")

//                .servers(
//                        List.of(new Server().url("https://localhost:8081/").description("running by intellij"),
//                                new Server().url("https://localhost:8082/").description("just for tyring feature won't work"))
                );


    }
}
