CREATE DATABASE crud_db;

\c crud_db;

CREATE TABLE clientes (
  id        SERIAL PRIMARY KEY,
  nome      VARCHAR(100) NOT NULL,
  email     VARCHAR(150) NOT NULL UNIQUE,
  telefone  VARCHAR(20),
  cidade    VARCHAR(80),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
