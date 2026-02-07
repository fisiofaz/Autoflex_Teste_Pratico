package com.autoflex.production_control;

import com.autoflex.production_control.entity.ProductComposition;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/compositions")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProductCompositionResource {

    @GET
    public List<ProductComposition> list() {
        return ProductComposition.listAll();
    }

    @POST
    @Transactional
    public Response create(ProductComposition composition) {
        // Validação básica: verificar se produto e matéria existem
        if (composition.product == null || composition.rawMaterial == null) {
            throw new WebApplicationException("Product and RawMaterial are required", 400);
        }
        composition.persist();
        return Response.status(Response.Status.CREATED).entity(composition).build();
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public Response delete(@PathParam("id") Long id) {
        boolean deleted = ProductComposition.deleteById(id);
        if (!deleted) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.noContent().build();
    }   
}