const express = require("express");
const router = express.Router();
const { createConnection } = require("../config/config");
const cliente = createConnection();

router.post("/createExercise", async (req, res) => {
  const { name, video, id_tipo } = req.body;

  if (!name || !id_tipo) {
    return res.status(400).json({
      error: "O campo 'nome' e 'id_tipo' não podem ser nulos.",
    });
  }
  const query =
    "INSERT INTO exercises (nome, video, id_tipo) VALUES ($1, $2, $3) RETURNING *";

  try {
    const result = cliente.query(query, [name, video, id_tipo]);
    res.status(201).json({ message: "Tipo cadastrado com sucesso!" });
  } catch (err) {
    console.error("Erro ao inserir tipo:", err);
    res
      .status(500)
      .json({ error: "Erro ao inserir o tipo no banco de dados." });
  }
});

router.get("/getExercisesByIdType", async (req, res) => {
  const { idTipo } = req.query;
  let query = `SELECT * FROM exercises WHERE id_tipo = $1`;
  try {
    const result = await cliente.query(query, [idTipo]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Erro ao recuperar rotinas:", err);
    res
      .status(500)
      .json({ error: "Erro ao recuperar as rotinas do banco de dados." });
  }
});
module.exports = router;
