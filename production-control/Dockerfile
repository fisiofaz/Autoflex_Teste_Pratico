# Etapa 1: Build
FROM maven:3.8.5-openjdk-17 AS build
COPY src /usr/src/app/src
COPY pom.xml /usr/src/app
WORKDIR /usr/src/app
RUN mvn clean package -DskipTests

# Etapa 2: Execução
FROM openjdk:17-jdk-slim
COPY --from=build /usr/src/app/target/quarkus-app/lib/ /app/lib/
COPY --from=build /usr/src/app/target/quarkus-app/*.jar /app/
COPY --from=build /usr/src/app/target/quarkus-app/app/ /app/app/
COPY --from=build /usr/src/app/target/quarkus-app/quarkus/ /app/quarkus/
WORKDIR /app
CMD ["java", "-jar", "quarkus-run.jar"]