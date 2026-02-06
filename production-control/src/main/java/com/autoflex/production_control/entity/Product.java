package com.autoflex.production_control.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "products")
public class Product extends PanacheEntity {
    @NotNull
    public String name;

    @NotNull
    public Double price;

    // Construtor vazio (obrigatório para o Hibernate)
    public Product() {}
}