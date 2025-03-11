package com.geto.fabricHub.service;

import com.geto.fabricHub.model.User;
import com.geto.fabricHub.repo.UserRepo;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.geto.fabricHub.model.UserProfile;

@Service
public class MyUserDetailService implements UserDetailsService {

    private final UserRepo repo;

    public MyUserDetailService(UserRepo repo) {
        this.repo = repo;
    }


    // here ur email will be passed (not the username)  -> OK
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        User user = repo.findByEmail(email);

        if(user == null){
            throw new UsernameNotFoundException("user of email" + email + " not found");
        }

        return new UserProfile(user);                // return the obj of userDetails that won't exist || so make class
    }
}
