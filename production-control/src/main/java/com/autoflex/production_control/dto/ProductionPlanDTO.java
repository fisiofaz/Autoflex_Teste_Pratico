package com.autoflex.production_control.dto;

public class ProductionPlanDTO {
    public String productName;
    public int quantityToProduce;
    public Double totalValue;

    // Construtor vazio (obrigatório para JSON)
    public ProductionPlanDTO() {
    }

    // Construtor completo
    public ProductionPlanDTO(String productName, int quantityToProduce, Double totalValue) {
        this.productName = productName;
        this.quantityToProduce = quantityToProduce;
        this.totalValue = totalValue;
    }

    // --- GETTERS  ---
    public String getProductName() {
        return productName;
    }

    public Integer getQuantity() {
        return quantityToProduce;
    }

    public Double getTotalValue() {
        return totalValue;
    }

    // --- SETTERS ---
    public void setProductName(String productName) {
        this.productName = productName;
    }

    public void setQuantity(Integer quantityToProduce) {
        this.quantityToProduce = quantityToProduce;
    }

    public void setTotalValue(Double totalValue) {
        this.totalValue = totalValue;
    }
}