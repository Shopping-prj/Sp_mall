package com.example.demo.dto;

import lombok.*;

@Data
public class CartAddRequestDTO {
    private String email;
    private String productId;
    private int count;
}
