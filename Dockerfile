# Etapa 1: Build
FROM maven:3.9-eclipse-temurin-17 AS build

# Copia a pasta inteira do backend para dentro da imagem
COPY production-control /usr/src/app/production-control

# Define a pasta de trabalho como a pasta do backend
WORKDIR /usr/src/app/production-control

# Roda o build lá dentro
RUN mvn clean package -DskipTests

# Etapa 2: Execução
FROM eclipse-temurin:17-jre-alpine
COPY --from=build /usr/src/app/production-control/target/quarkus-app/lib/ /app/lib/
COPY --from=build /usr/src/app/production-control/target/quarkus-app/*.jar /app/
COPY --from=build /usr/src/app/production-control/target/quarkus-app/app/ /app/app/
COPY --from=build /usr/src/app/production-control/target/quarkus-app/quarkus/ /app/quarkus/
WORKDIR /app
CMD ["java", "-jar", "quarkus-run.jar"]