const express = require("express");
const router = express.Router();
const { createConnection } = require("../config/config");
const cliente = createConnection();

router.post("/insertRoutine", async (req, res) => {
  const { name, comments, startDate, endDate, difficult, goal, idStudent } =
    req.body;

  const query = `INSERT INTO routine (name, comments, startdate, enddate, difficulty, goal, idstudent) VALUES ($1, $2, $3, $4, $5, $6, $7)`;

  try {
    const result = await cliente.query(query, [
      name,
      comments,
      startDate,
      endDate,
      difficult,
      goal,
      idStudent,
    ]);
    console.log("Rotina cadastrada com sucesso!");
    res.status(201).json({ message: "Rotina cadastrada com sucesso!" });
  } catch (err) {
    console.error("Erro ao inserir rotina:", err);
    res
      .status(500)
      .json({ error: "Erro ao inserir os dados no banco de dados." });
  }
});

router.post("/insertDayTraining", async (req, res) => {
  const { day, name, comments, idRoutine } = req.body;

  const query = `INSERT INTO day_training (day, name, comments,id_routine) VALUES ($1, $2, $3, $4 )`;

  try {
    const result = await cliente.query(query, [day, name, comments, idRoutine]);
    console.log("Rotina cadastrada com sucesso!");
    res.status(201).json({ message: "Rotina cadastrada com sucesso!" });
  } catch (err) {
    console.error("Erro ao inserir rotina:", err);
    res
      .status(500)
      .json({ error: "Erro ao inserir os dados no banco de dados." });
  }
});

router.get("/getRoutines", async (req, res) => {
  const { idStudent } = req.query;
  const query = `SELECT * FROM routine WHERE idstudent = $1`;

  try {
    const result = await cliente.query(query, [idStudent]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Erro ao recuperar rotinas:", err);
    res
      .status(500)
      .json({ error: "Erro ao recuperar as rotinas do banco de dados." });
  }
});

router.get("/getDayTraining", async (req, res) => {
  const { idRoutine } = req.query;
  let query = `SELECT * FROM day_training WHERE id_routine = $1`;
  if (!idRoutine) {
    query = `SELECT * FROM day_training`;
  }
  try {
    const result = await cliente.query(query, [idRoutine]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Erro ao recuperar rotinas:", err);
    res
      .status(500)
      .json({ error: "Erro ao recuperar as rotinas do banco de dados." });
  }
});

router.get("/getDayTrainingByIdDayTrainig", async (req, res) => {
  const { idDayTrainig } = req.query;
  const query = `SELECT * FROM day_training WHERE id = $1`;

  try {
    const result = await cliente.query(query, [idDayTrainig]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Erro ao recuperar rotinas:", err);
    res
      .status(500)
      .json({ error: "Erro ao recuperar as rotinas do banco de dados." });
  }
});

router.get("/getRoutinesIdRoutine", async (req, res) => {
  const { idRoutine } = req.query; // Use req.query para obter parâmetros de consulta
  const query = `SELECT * FROM routine WHERE id_routine = $1`;

  try {
    const result = await cliente.query(query, [idRoutine]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Erro ao recuperar rotinas:", err);
    res
      .status(500)
      .json({ error: "Erro ao recuperar as rotinas do banco de dados." });
  }
});

module.exports = router;

module.exports = router;
