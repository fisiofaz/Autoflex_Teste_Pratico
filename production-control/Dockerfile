# Etapa 1: Build (Usando Maven com Java 17 Temurin)
FROM maven:3.9-eclipse-temurin-17 AS build
COPY src /usr/src/app/src
COPY pom.xml /usr/src/app
WORKDIR /usr/src/app
RUN mvn clean package -DskipTests

# Etapa 2: Execução (Usando Java 17 Temurin Leve)
FROM eclipse-temurin:17-jre-alpine
COPY --from=build /usr/src/app/target/quarkus-app/lib/ /app/lib/
COPY --from=build /usr/src/app/target/quarkus-app/*.jar /app/
COPY --from=build /usr/src/app/target/quarkus-app/app/ /app/app/
COPY --from=build /usr/src/app/target/quarkus-app/quarkus/ /app/quarkus/
WORKDIR /app
CMD ["java", "-jar", "quarkus-run.jar"]