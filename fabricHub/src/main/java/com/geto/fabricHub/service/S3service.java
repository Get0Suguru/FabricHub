package com.geto.fabricHub.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;

@Service
public class S3Service {

    @Value("${aws.s3.bucket}")
    private String bucketName;

    @Value("${aws.s3.region}")
    private String region;

    private S3Client s3Client;

    // Lazily build the client so bucket/region come from application.properties,
    // not hardcoded. Credentials are picked up automatically from the EC2
    // instance's IAM role (via the default credential provider chain) - no
    // access keys anywhere in this code or in application.properties.
    private S3Client getClient() {
        if (s3Client == null) {
            s3Client = S3Client.builder()
                    .region(Region.of(region))
                    .build();
        }
        return s3Client;
    }

    /**
     * Uploads a product image to S3 and returns the public object URL,
     * which gets stored directly in Product.imageUrl / ProductDTO.imageUrl.
     */
    public String uploadProductImage(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot upload an empty file");
        }

        String originalName = file.getOriginalFilename() == null ? "image" : file.getOriginalFilename();
        String extension = originalName.contains(".")
                ? originalName.substring(originalName.lastIndexOf('.'))
                : "";
        String key = "products/" + UUID.randomUUID() + extension;

        PutObjectRequest putRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentType(file.getContentType())
                .build();

        getClient().putObject(putRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

        return String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, key);
    }
}
