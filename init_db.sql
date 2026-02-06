-- Tabela de Matérias-Primas (Raw Materials)
CREATE TABLE raw_materials (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    stock_quantity DOUBLE PRECISION NOT NULL DEFAULT 0
);

-- Tabela de Produtos (Products)
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DOUBLE PRECISION NOT NULL
);

-- Tabela de Composição (Quantos de cada material o produto usa)
CREATE TABLE product_compositions (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    raw_material_id INTEGER NOT NULL,
    quantity_required DOUBLE PRECISION NOT NULL,
    
    CONSTRAINT fk_product
      FOREIGN KEY(product_id) 
      REFERENCES products(id)
      ON DELETE CASCADE,
      
    CONSTRAINT fk_raw_material
      FOREIGN KEY(raw_material_id) 
      REFERENCES raw_materials(id)
      ON DELETE RESTRICT
);