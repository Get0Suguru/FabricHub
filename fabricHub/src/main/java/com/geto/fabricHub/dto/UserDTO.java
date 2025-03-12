package com.geto.fabricHub.dto;


import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class UserDTO {

    @NotEmpty
    private String email;
    @NotEmpty
    private String password;

    private String firstName;
    private String lastName;
    private Long mobile;



}
