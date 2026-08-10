package com.geto.fabricHub.controller;

import com.geto.fabricHub.service.S3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/products")
public class ProductImageController {

    @Autowired
    private S3Service s3Service;

    // Admin uploads an image here first, gets back a URL, then sends that URL
    // as ProductDTO.imageUrl in the existing /api/admin/products/create call.
    @PostMapping("/upload-image")
    public ResponseEntity<Map<String, String>> uploadProductImage(
            @RequestParam("file") MultipartFile file) throws IOException {
        String imageUrl = s3Service.uploadProductImage(file);
        return new ResponseEntity<>(Map.of("imageUrl", imageUrl), HttpStatus.OK);
    }
}
