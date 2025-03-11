package com.geto.fabricHub.service;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JWTService {

    private static final String SECRET_KEY = "fabrichubisdick_and_iamachutpaglu_1234";

    public static SecretKey getKey(){
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    public static String generateToken(String email) {
        Map<String, Object> claims = new HashMap<>();
        return Jwts.builder()
                .claims().add(claims)
                .subject(email)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 10000 * 60 * 60 * 30))
                .and()
                .signWith(getKey())
                .compact();
    }

    public boolean validateToken(String jwtToken, UserDetails userDetails) {

        String username = extractEmail(jwtToken);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(jwtToken));
        //yes that's all we check but -> extracting username or (claims) from token requires it to be a valid jwt token
    }

//-------------------------------------------------------------------------------------------------------------------
//    stuff required to extract username from token (sequential code)

    public String extractEmail(String jwtToken) {
        return extractClaim(jwtToken, Claims::getSubject);
    }

    private boolean isTokenExpired(String jwtToken) {
        return extractExpiration(jwtToken).before(new Date());
    }

    private Date extractExpiration(String jwtToken) {
        return extractClaim(jwtToken, Claims::getExpiration);
    }



    private <T> T extractClaim(String jwtToken, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaim(jwtToken);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaim(String jwtToken) {
        return Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(jwtToken)
                .getPayload();
    }
}
