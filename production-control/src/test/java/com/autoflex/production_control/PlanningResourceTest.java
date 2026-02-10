package com.autoflex.production_control;

import io.quarkus.test.junit.QuarkusTest;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.autoflex.production_control.entity.Product;
import com.autoflex.production_control.entity.RawMaterial;
import com.autoflex.production_control.entity.ProductComposition;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.Matchers.hasSize;

@QuarkusTest
public class PlanningResourceTest {

    // Antes de cada teste, limpamos o banco e preparamos os dados
    @BeforeEach
    @Transactional
    public void setup() {
        // 1. Limpa tudo (ordem importa por causa das chaves estrangeiras)
        ProductComposition.deleteAll();
        Product.deleteAll();
        RawMaterial.deleteAll();

        // 2. Cria Matéria-Prima: Farinha (Tem 500g no estoque)
        RawMaterial farinha = new RawMaterial();
        farinha.name = "Farinha Teste";
        farinha.stockQuantity = 500.0;
        farinha.persist();

        // 3. Cria Produto: Bolo (Custa 100 reais)
        Product bolo = new Product();
        bolo.name = "Bolo Teste";
        bolo.price = 100.0;
        bolo.persist();

        // 4. Cria Receita: Bolo gasta 100g de farinha
        ProductComposition receita = new ProductComposition();
        receita.product = bolo;
        receita.rawMaterial = farinha;
        receita.quantityRequired = 100.0;
        receita.persist();
    }

    @Test
    public void testPlanningCalculation() {
        // Cenário:
        // Temos 500g de Farinha.
        // O Bolo gasta 100g.
        // Esperamos que o sistema sugira produzir 5 Bolos.
        // Valor total esperado: 5 * 100.00 = 500.00

        given()
                .when().get("/planning")
                .then()
                .statusCode(200) // A API deve responder OK
                .body("$", hasSize(1)) // Deve retornar 1 item na lista
                .body("[0].productName", is("Bolo Teste")) // Nome do produto
                .body("[0].quantity", is(5)) // Quantidade calculada (500 / 100 = 5)
                .body("[0].totalValue", is(500.0f)); // Valor total (5 * 100 = 500)
    }
}