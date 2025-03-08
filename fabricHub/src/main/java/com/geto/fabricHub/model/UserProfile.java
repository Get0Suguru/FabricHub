package com.geto.fabricHub.model;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class UserProfile implements UserDetails {

    private User userObj;

    public UserProfile(User userObj){
        this.userObj = userObj;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(new SimpleGrantedAuthority("user"));
    }

    @Override
    public String getPassword() {
        return userObj.getPassword();
    }

    @Override
    public String getUsername() {
        return userObj.getEmail();
    }
}
