const express = require("express");
const router = express.Router();
const { createConnection } = require("../config/config");
const cliente = createConnection();

router.post("/createType", async (req, res) => {
  const { name } = req.body; // Receba o nome do tipo do corpo da solicitação
  if (!name) {
    return res.status(400).json({ error: "O campo 'nome' não pode ser nulo." });
  }

  const query = `INSERT INTO tipo (nome) VALUES ($1)`;

  try {
    const result = await cliente.query(query, [name]);
    res.status(201).json({ message: "Tipo cadastrado com sucesso!" });
  } catch (err) {
    console.error("Erro ao inserir tipo:", err);
    res
      .status(500)
      .json({ error: "Erro ao inserir o tipo no banco de dados." });
  }
});

router.get("/getAllTypes", async (req, res) => {
  const query = "SELECT * FROM tipo";

  try {
    const result = await cliente.query(query);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Erro ao recuperar tipos:", err);
    res
      .status(500)
      .json({ error: "Erro ao recuperar os tipos do banco de dados." });
  }
});

router.get("/getTypeById", async (req, res) => {
  const { idType } = req.query;

  const query = "SELECT * FROM tipo WHERE id = $1";

  try {
    const result = await cliente.query(query, [idType]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Tipo não encontrado." });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao recuperar o tipo:", err);
    res
      .status(500)
      .json({ error: "Erro ao recuperar o tipo do banco de dados." });
  }
});

router.put("/alterType/:typeId", async (req, res) => {
  const { typeId } = req.params;
  const typeName = req.body;

  const query = "UPDATE tipo SET nome = $1 WHERE id = $2";

  try {
    const result = await cliente.query(query, [typeName.nome, typeId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Tipo não encontrado." });
    }

    res.status(200).json({ message: "Tipo atualizado com sucesso." });
  } catch (err) {
    console.error("Erro ao atualizar o tipo:", err);
    res
      .status(500)
      .json({ error: "Erro ao atualizar o tipo no banco de dados." });
  }
});

router.delete("/deleteType/:typeId", async (req, res) => {
  const { typeId } = req.params;

  const query = "DELETE FROM tipo WHERE id = $1";

  try {
    const result = await cliente.query(query, [typeId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Tipo não encontrado." });
    }

    res.status(200).json({ message: "Tipo excluído com sucesso." });
  } catch (err) {
    console.error("Erro ao excluir o tipo:", err);
    res
      .status(500)
      .json({ error: "Erro ao excluir o tipo no banco de dados." });
  }
});

module.exports = router;
