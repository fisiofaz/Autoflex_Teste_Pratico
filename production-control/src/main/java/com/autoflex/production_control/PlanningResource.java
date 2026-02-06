package com.autoflex.production_control;

import com.autoflex.production_control.dto.ProductionPlanDTO;
import com.autoflex.production_control.entity.Product;
import com.autoflex.production_control.entity.ProductComposition;
import com.autoflex.production_control.entity.RawMaterial;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import java.util.*;

@Path("/planning")
public class PlanningResource {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<ProductionPlanDTO> calculateProduction() {
        // 1. Buscamos tudo do banco
        List<Product> products = Product.listAll();
        List<RawMaterial> materials = RawMaterial.listAll();
        List<ProductComposition> compositions = ProductComposition.listAll();

        // 2. Ordenamos produtos pelo PREÇO (Maior para o menor) - REGRA DO TESTE
        products.sort((p1, p2) -> p2.price.compareTo(p1.price));

        // 3. Criamos um mapa do estoque atual para ir "gastando" na memória
        Map<Long, Double> temporaryStock = new HashMap<>();
        for (RawMaterial rm : materials) {
            temporaryStock.put(rm.id, rm.stockQuantity);
        }

        List<ProductionPlanDTO> plan = new ArrayList<>();

        // 4. Algoritmo Guloso: Tenta produzir o máximo do produto mais caro
        for (Product product : products) {

            // Filtra as matérias-primas desse produto
            List<ProductComposition> recipe = compositions.stream()
                    .filter(c -> c.product.id.equals(product.id))
                    .toList();

            if (recipe.isEmpty())
                continue; // Se não tem receita, pula

            int possibleQuantity = 0;

            // Loop infinito que quebra quando acabar o estoque
            while (true) {
                boolean canMakeOneMore = true;

                // Verifica se tem estoque para TODOS os ingredientes
                for (ProductComposition item : recipe) {
                    Double currentStock = temporaryStock.getOrDefault(item.rawMaterial.id, 0.0);
                    if (currentStock < item.quantityRequired) {
                        canMakeOneMore = false;
                        break;
                    }
                }

                if (canMakeOneMore) {
                    // Se dá pra fazer, "gasta" o estoque virtualmente e conta +1
                    for (ProductComposition item : recipe) {
                        Double currentStock = temporaryStock.get(item.rawMaterial.id);
                        temporaryStock.put(item.rawMaterial.id, currentStock - item.quantityRequired);
                    }
                    possibleQuantity++;
                } else {
                    break; // Acabou o estoque para este produto
                }
            }

            if (possibleQuantity > 0) {
                plan.add(new ProductionPlanDTO(
                        product.name,
                        possibleQuantity,
                        possibleQuantity * product.price));
            }
        }

        return plan;
    }
}