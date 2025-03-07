package com.geto.fabricHub.repo;

import com.geto.fabricHub.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {

//  no need to tell the query its auto as per name and passed attribute
    User findByEmail(String email);
}
