package com.geto.fabricHub.service;


import com.geto.fabricHub.exception.UserException;
import com.geto.fabricHub.model.Address;

import java.util.List;

public interface AddressService {

    public List<Address> getUserAddress(String jwtToken) throws UserException;

    public Address createNewAddress(Address address, String jwtToken) throws UserException;

    public Address getAddressById(Long id, String jwtToken) throws UserException;
}
