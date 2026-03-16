const express = require("express");
const cors = require("cors");
const pool = require("./db");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.get("/api/clientes", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM clientes ORDER BY id ASC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.get("/api/clientes/:id", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM clientes WHERE id = $1", [
      req.params.id,
    ]);
    if (rows.length === 0)
      return res.status(404).json({ erro: "Cliente não encontrado" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.post("/api/clientes", async (req, res) => {
  const { nome, email, telefone, cidade } = req.body;
  if (!nome || !email)
    return res.status(400).json({ erro: "Nome e e-mail são obrigatórios" });
  try {
    const { rows } = await pool.query(
      "INSERT INTO clientes (nome, email, telefone, cidade) VALUES ($1, $2, $3, $4) RETURNING *",
      [nome, email, telefone, cidade]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === "23505")
      return res.status(409).json({ erro: "E-mail já cadastrado" });
    res.status(500).json({ erro: err.message });
  }
});

app.put("/api/clientes/:id", async (req, res) => {
  const { nome, email, telefone, cidade } = req.body;
  if (!nome || !email)
    return res.status(400).json({ erro: "Nome e e-mail são obrigatórios" });
  try {
    const { rows } = await pool.query(
      "UPDATE clientes SET nome=$1, email=$2, telefone=$3, cidade=$4 WHERE id=$5 RETURNING *",
      [nome, email, telefone, cidade, req.params.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ erro: "Cliente não encontrado" });
    res.json(rows[0]);
  } catch (err) {
    if (err.code === "23505")
      return res.status(409).json({ erro: "E-mail já cadastrado" });
    res.status(500).json({ erro: err.message });
  }
});

app.delete("/api/clientes/:id", async (req, res) => {
  try {
    const { rowCount } = await pool.query(
      "DELETE FROM clientes WHERE id = $1",
      [req.params.id]
    );
    if (rowCount === 0)
      return res.status(404).json({ erro: "Cliente não encontrado" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () =>
    console.log(`Servidor rodando em http://localhost:${PORT}`)
  );
}

module.exports = app;
