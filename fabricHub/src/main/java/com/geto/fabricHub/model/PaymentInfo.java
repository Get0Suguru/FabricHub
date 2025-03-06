package com.geto.fabricHub.model;

import jakarta.persistence.Embeddable;
import jakarta.persistence.Entity;

@Embeddable
public class PaymentInfo {

    private String cardHolderName;
    private String cardNumber;
    private String expirationDate;
    private String cvv;

}
