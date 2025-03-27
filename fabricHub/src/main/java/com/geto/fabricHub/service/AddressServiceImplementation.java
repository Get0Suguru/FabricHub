package com.geto.fabricHub.service;

import com.geto.fabricHub.exception.UserException;
import com.geto.fabricHub.model.Address;
import com.geto.fabricHub.model.User;
import com.geto.fabricHub.repo.AddressRepo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddressServiceImplementation implements AddressService {

    private AddressRepo addressRepo;
    private UserService userService;

    public AddressServiceImplementation(AddressRepo addressRepo, UserService userService) {
        this.addressRepo = addressRepo;
        this.userService = userService;
    }

    @Override
    public List<Address> getUserAddress(String jwtToken) throws UserException {
        User user = userService.findUserProfileByJwt(jwtToken);
        return addressRepo.findByUser(user);
    }

    @Override
    public Address createNewAddress(Address address, String jwtToken) throws UserException {
        User user = userService.findUserProfileByJwt(jwtToken);

        address.setUser(user);
        return addressRepo.save(address);

    }

    @Override
    public Address getAddressById(Long id, String jwtToken) throws UserException {

        User user = userService.findUserProfileByJwt(jwtToken);
        return addressRepo.findByIdAndUser(id,user);}
}
