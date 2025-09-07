package com.geto.fabricHub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class FabricHubApplication {

	public static void main(String[] args) {
		SpringApplication.run(FabricHubApplication.class, args);
	}

}
