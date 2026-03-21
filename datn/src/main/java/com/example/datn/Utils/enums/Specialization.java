package com.example.datn.Utils.enums;

import lombok.Getter;

@Getter
public enum Specialization {
    NOI_TONG_QUAT("Nội tổng quát") , 
    NGOAI_KHOA("Ngoại khoa") , 
    SAN_PHU_KHOA("Sản phụ khoa") , 
    NHI_KHOA("Nhi khoa") , 
    TIM_MACH("Tim mạch") , 
    DA_LIEU("Da liễu") , 
    TAI_MUI_HONG("Tai mũi họng") , 
    MAT("Mắt") , 
    THAN_KINH("Thần kinh"),
    CO_XUONG_KHOP("Cơ xương khớp"),
    TIEU_HOA("Tiêu hóa"),
    NOI_TIET("Nội tiết"),
    HO_HAP("Hô hấp"),
    TAM_LY("Tâm lý") ;

    private String description ;

    private Specialization(String description) {
        this.description = description;
    }

}
