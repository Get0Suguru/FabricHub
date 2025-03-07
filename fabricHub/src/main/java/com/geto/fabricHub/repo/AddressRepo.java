package com.geto.fabricHub.repo;

import com.geto.fabricHub.model.Address;
import com.geto.fabricHub.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AddressRepo extends JpaRepository<Address, Long> {

    List<Address> findByUser(User user);

    Address findByIdAndUser(Long id, User user);
}
