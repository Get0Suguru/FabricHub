package com.geto.fabricHub.controller;

import com.geto.fabricHub.dto.ApiResponse;
import com.geto.fabricHub.exception.UserException;
import com.geto.fabricHub.model.Address;
import com.geto.fabricHub.service.AddressService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/api/address")
public class AddressController {


    private AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    //get all address related to user
    @GetMapping("/all")
    public ResponseEntity<List<Address>> getAllUserAddress(@CookieValue("jwtToken") String jwtToken) throws UserException {
        return new ResponseEntity<>(addressService.getUserAddress(jwtToken), HttpStatus.ACCEPTED);
    }

    @PostMapping("/create")
    public ResponseEntity<Address> createNewAddress(@RequestBody Address address, @CookieValue("jwtToken") String jwtToken) throws UserException {
        Address selectedAddress = addressService.createNewAddress(address, jwtToken);
        return new ResponseEntity<>(selectedAddress, HttpStatus.ACCEPTED);

    }

    @GetMapping("/{id}")
    public ResponseEntity<Address> getAddressById(@PathVariable("id") Long id, @CookieValue("jwtToken") String jwtToken) throws UserException {
        return new ResponseEntity<>(addressService.getAddressById(id, jwtToken), HttpStatus.ACCEPTED);
    }


}
