package com.autoflex.production_control.dto;

public class ProductionPlanDTO {
    public String productName;
    public int quantityToProduce;
    public Double totalValue;

    public ProductionPlanDTO(String productName, int quantityToProduce, Double totalValue) {
        this.productName = productName;
        this.quantityToProduce = quantityToProduce;
        this.totalValue = totalValue;
    }
}