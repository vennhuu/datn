package com.example.datn.Utils.enums;

import lombok.Getter;

@Getter
public enum Degree {

    BS("Bác sĩ") ,
    THS("Thạc sĩ") ,
    TS("Tiến sĩ") ,
    BSCK1("BS Chuyên khoa I") ,
    BSCK2("BS Chuyên khoa II");
    
    private String description ;

    private Degree(String description) {
        this.description = description;
    }
    
}
