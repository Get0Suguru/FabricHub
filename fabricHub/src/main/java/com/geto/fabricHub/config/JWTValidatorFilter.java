package com.geto.fabricHub.config;

import com.geto.fabricHub.service.JWTService;
import com.geto.fabricHub.service.MyUserDetailService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Optional;

@Component
public class JWTValidatorFilter extends OncePerRequestFilter {

    @Autowired
    private JWTService service;

    @Autowired
    private MyUserDetailService userDetailService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        // wrote for checking purpose only
//        System.out.println("------------------- Processing Request to: " + request.getRequestURI());
        Cookie[] cookies = request.getCookies();
//        if (cookies != null && cookies.length > 0) {
//            System.out.println("Cookies found in the request:");
//            for (Cookie cookie : cookies) {
//                System.out.println("  Name: " + cookie.getName() + ", Value: " + cookie.getValue());
//            }
//        } else {
//            System.out.println("No cookies found in the request.");
//        }




        try{
//        String authHeader = request.getHeader("Authorization");

        String jwtToken = null;
        String emailId = null;

//          this one is if the token is inside authentication header
//            if(authHeader != null && authHeader.startsWith("Bearer")){
//                jwtToken = authHeader.substring(7);
//                emailId = service.extractEmail(jwtToken);
//            }

            System.out.println(cookies.length);
            if(cookies != null){
                Optional<Cookie> jwtCookie = Arrays.stream(cookies).filter(cookie->"jwtToken".equals(cookie.getName())).findFirst();

                if(jwtCookie.isPresent()){
                    jwtToken = jwtCookie.get().getValue();
                    emailId = service.extractEmail(jwtToken);

                    System.out.println(jwtToken);
                    System.out.println(emailId);
                }
            }


            if(emailId !=null && SecurityContextHolder.getContext().getAuthentication() ==null ){
                UserDetails userDetails = userDetailService.loadUserByUsername(emailId);

                if(service.validateToken(jwtToken, userDetails)){                                          //requires the object-principal (userPrincipal)
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }

            }
        }
        catch(Exception e){
            System.out.println("something is wrong with jwt token for more details make the exception throw and handel it");
        }


        filterChain.doFilter(request, response);
    }
}
