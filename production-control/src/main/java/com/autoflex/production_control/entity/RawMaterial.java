package com.autoflex.production_control.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "raw_materials")
public class RawMaterial extends PanacheEntity {
    @NotNull
    public String name;

    @NotNull
    public Double stockQuantity; // Estoque disponível

    public RawMaterial() {}
}