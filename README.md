# 🏭 Autoflex Control - Sistema de Planejamento de Produção

Sistema Full Stack desenvolvido como Desafio Técnico para a Autoflex.
O objetivo é gerenciar produtos, matérias-primas e, através de um algoritmo inteligente, sugerir o melhor plano de produção baseado no valor agregado dos produtos e no estoque disponível.

---

## 🚀 Tecnologias Utilizadas

Este projeto foi construído seguindo rigorosamente os requisitos do desafio, utilizando arquitetura moderna, separação de conceitos e **Testes Automatizados**.

### Backend (API)
- **Java 17**
- **Quarkus Framework** (Supersonic Subatomic Java)
- **Hibernate ORM com Panache** (Persistência)
- **Resteasy Reactive** (API REST)
- **JUnit 5 & RestAssured** (Testes de Integração)
- **Algoritmo Guloso (Greedy)** para otimização de produção

### Frontend (Interface)
- **React.js** (Vite)
- **Tailwind CSS** (Estilização Responsiva)
- **React Router DOM** (Navegação SPA)
- **Axios** (Integração API)

### Infraestrutura & Banco de Dados
- **PostgreSQL** (Banco de Dados Relacional)
- **Docker** (Containerização do Banco)

---

## 🧠 Funcionalidades Principais

1.  **Gerenciamento de Produtos:** CRUD completo com definição de preços.
2.  **Controle de Estoque:** Gestão de matérias-primas e insumos.
3.  **Engenharia de Receitas:** Definição técnica da composição de cada produto (Relacionamento N:N).
4.  **Planejamento Inteligente (Diferencial):**
    - O sistema analisa o estoque atual.
    - Ordena os produtos pelo **Maior Valor de Venda** (Priorização).
    - Calcula automaticamente a quantidade máxima possível de produção.
    - Exibe o resultado e o faturamento previsto em um Dashboard.

---

## ⚙️ Como Rodar o Projeto

### Pré-requisitos
- Node.js e NPM
- Java JDK 17+
- Docker Desktop (instalado e rodando)

### Passo 1: Subir o Banco de Dados (Docker)
Abra um terminal na raiz do projeto e execute:

```bash
docker run --name autoflex-db -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password -e POSTGRES_DB=production_db -p 5432:5432 -d postgres
```

### Passo 2: Iniciar o Backend (API)
Em um terminal, navegue até a pasta production-control:

```bash
cd production-control
./mvnw compile quarkus:dev
```
### Passo 3: Iniciar o Frontend (React)
Em outro terminal, navegue até a pasta ```frontend```:

```bash
cd frontend
npm install
npm run dev
```
O Sistema estará acessível em: http://localhost:5173

## ✅ Executando os Testes
Para validar a integridade da regra de negócio (Cálculo de Planejamento), execute os testes de integração no backend:

```bash
cd production-control
./mvnw test
```

## 📱 Layout

O projeto conta com uma interface moderna desenvolvida com Tailwind CSS, adaptando-se perfeitamente a dispositivos móveis e desktops, incluindo menu responsivo e tabelas adaptáveis.

__________________________________________________________________________________________

Desenvolvido por Fábio Andre Zatta