package com.autoflex.production_control;

import com.autoflex.production_control.entity.RawMaterial;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/raw-materials")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class RawMaterialResource {

    @GET
    public List<RawMaterial> list() {
        return RawMaterial.listAll();
    }

    @POST
    @Transactional
    public Response create(RawMaterial rawMaterial) {
        rawMaterial.persist();
        return Response.status(Response.Status.CREATED).entity(rawMaterial).build();
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public Response update(@PathParam("id") Long id, RawMaterial dto) {
        // Busca no banco
        RawMaterial entity = RawMaterial.findById(id);

        if (entity == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        // Atualiza os dados
        entity.name = dto.name;
        entity.stockQuantity = dto.stockQuantity;
        
        // O Panache salva automaticamente ao fim da transação
        return Response.ok(entity).build();
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public Response delete(@PathParam("id") Long id) {
        // 1. Tenta deletar
        boolean deleted = RawMaterial.deleteById(id);
        
        if (!deleted) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        
        // 2. Retorna sucesso sem conteúdo (204 No Content)
        return Response.noContent().build();
    }
}