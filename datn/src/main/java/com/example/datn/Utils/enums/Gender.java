package com.example.datn.Utils.enums;

import lombok.Getter;

@Getter
public enum Gender {
    NAM("Nam"),
    NU("Nữ"),
    KHAC("Khác");

    private final String description;
    Gender(String description) {
        this.description = description;
    }
}