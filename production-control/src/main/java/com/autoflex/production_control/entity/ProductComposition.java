package com.autoflex.production_control.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.JoinColumn;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "product_compositions")
public class ProductComposition extends PanacheEntity {

    @ManyToOne // Muitos ingredientes para um produto
    @JoinColumn(name = "product_id")
    @NotNull
    public Product product;

    @ManyToOne // Muitas receitas usam esse ingrediente
    @JoinColumn(name = "raw_material_id")
    @NotNull
    public RawMaterial rawMaterial;

    @NotNull
    public Double quantityRequired; // Quanto desse ingrediente é necessário

    public ProductComposition() {
    }
}