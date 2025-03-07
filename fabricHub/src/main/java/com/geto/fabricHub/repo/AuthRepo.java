package com.geto.fabricHub.repo;

import com.geto.fabricHub.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

// yes we are using user model object for this
public interface AuthRepo extends JpaRepository<User, Long> {

    User findByEmail(String email);
}
