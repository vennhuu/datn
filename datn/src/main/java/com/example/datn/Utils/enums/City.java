package com.example.datn.Utils.enums;

import lombok.Getter;

@Getter
public enum City {
    HA_NOI("Hà Nội") ,
    DA_NANG("Đà Nẵng") ,
    HO_CHI_MINH("Hồ Chí Minh") ;

    private String description ;

    private City(String description) {
        this.description = description;
    }

}
