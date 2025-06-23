package com.geto.fabricHub.service;

import com.geto.fabricHub.dto.UserDTO;
import com.geto.fabricHub.exception.UserException;
import com.geto.fabricHub.model.Cart;
import com.geto.fabricHub.model.User;
import com.geto.fabricHub.repo.AuthRepo;
import com.geto.fabricHub.repo.CartRepo;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImplementation implements AuthService {


    private AuthRepo authRepo;
    private AuthenticationManager authManager;                                          //authManager from spring just customized in filterChain
    private CartRepo cartRepo;

    public AuthServiceImplementation(AuthRepo authRepo, AuthenticationManager authManager, CartRepo cartRepo) {
        this.authRepo = authRepo;
        this.authManager = authManager;
        this.cartRepo = cartRepo;
    }

    @Override
    public String verifyUser(UserDTO loginObj, HttpServletResponse response) throws UserException{

        if(authRepo.findByEmail(loginObj.getEmail()) == null){
            return "No User Found with this email";
        }

        Authentication auth;
        try{
            auth = authManager.authenticate(new UsernamePasswordAuthenticationToken(loginObj.getEmail(), loginObj.getPassword()));
        }
        catch(BadCredentialsException e){
            return "Incorrect Password";
        }

        if(auth.isAuthenticated()){
            String jwtToken = JWTService.generateToken(loginObj.getEmail());  // this generates token which contains username(which's email in that case) (claims - can add as much i like) ROLE - ig

            // set cookie manually for samesite support



//            String cookieValue = String.format("jwtToken=%s; Path=/; HttpOnly; SameSite=Lax", jwtToken);
//            response.addHeader("Set-Cookie", cookieValue);
            String cookieValue = String.format(
                    "jwtToken=%s; Path=/; HttpOnly; Secure; SameSite=None",
                    jwtToken
            );
            response.addHeader("Set-Cookie", cookieValue);
            return "Login successful";
        }

        return "Login Failed";
    }



    @Override
    public void registerUser(UserDTO userObj) throws UserException {
        String email = userObj.getEmail();
        String password = userObj.getPassword();

        if(authRepo.findByEmail(email) != null){
            throw new UserException("email is already registered with another account");
        }

        userObj.setPassword(new BCryptPasswordEncoder(12).encode(password));

        User user = new User();
        user.setEmail(email);
        user.setPassword(userObj.getPassword());
        user.setFirstName(userObj.getFirstName());
        user.setLastName(userObj.getLastName());
        user.setMobile(userObj.getMobile());

        authRepo.save(user);                // doin it after cart gives error coz cart itself rely on having userId and that's possibl
                                            // once we let it go to sql and get its id ok
                                            // no need to add cart to user as the join column is on cart side


        Cart cart = new Cart();
        cart.setUser(user);

        cartRepo.save(cart);                // this will ensure to create a cart entity for each new user by default
                                            // do adding products will be seemless


        System.out.println("user registered -> now login to get token");
    }


    // logout
    @Override
    public void logoutUser(String jwtToken, HttpServletResponse response) throws UserException {

        Cookie cookie = new Cookie("jwt", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(true); // if using HTTPS
        cookie.setPath("/");
        cookie.setMaxAge(0); // Expire immediately
        response.addCookie(cookie);

        SecurityContextHolder.clearContext();
    }
}
