const express = require("express");
const router = express.Router();
const { createConnection } = require("../config/config");
const cliente = createConnection();

router.post("/createTraining", async (req, res) => {
  const { name, id_exercise, id_day_training } = req.body;

  const query =
    "INSERT INTO training (name, id_exercise, id_day_training) VALUES ($1, $2, $3) RETURNING *";

  try {
    const result = cliente.query(query, [name, id_exercise, id_day_training]);
    res.status(201).json({ message: "Tipo cadastrado com sucesso!" });
  } catch (err) {
    console.error("Erro ao inserir tipo:", err);
    res
      .status(500)
      .json({ error: "Erro ao inserir o tipo no banco de dados." });
  }
});
router.post("/finishTraining", async (req, res) => {
  const { idDayTraining, start_time, end_time, data, difficult, comment} = req.body;

  const query =
    "INSERT INTO historical_training (training_id, start_time, end_time, data, difficult, comment) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";

  try {
    const result = cliente.query(query, [idDayTraining, start_time, end_time, data, difficult, comment]);
    res.status(201).json({ message: "Treino finalizado cadastrado com sucesso!" });
  } catch (err) {
    console.error("Erro ao inserir Treino finalizado:", err);
    res
      .status(500)
      .json({ error: "Erro ao inserir o Treino finalizado no banco de dados." });
  }
});
router.get("/historicalTrainings", async (req, res) => {
  const { idTeacher } = req.query;
  const query = `
  select h.* , d.day, d.name, s.firstname, s.lastname from historical_training h 
  inner join day_training d on d.id = h.training_id
  inner join routine r on  CAST(r.id_routine AS VARCHAR) = d.id_routine
  inner join student s on r.idstudent =  CAST(s.id AS VARCHAR)
  where s.idteacher = $1;
`;
  try {
    const result = await cliente.query(query, [idTeacher]);
    res.status(200).json({
      message: "Histórico recuperado com sucesso!",
      data: result.rows,
    });
  } catch (err) {
    console.error("Erro ao recuperar treinamentos:", err);
    res
      .status(500)
      .json({ error: "Erro ao recuperar treinamentos no banco de dados." });
  }
});

router.get("/trainingByTrainingId", async (req, res) => {
  const { idDayTraining } = req.query;

  const query =
    "SELECT t.*,  e.video FROM training t inner join exercises e on t.id_exercise = CAST(e.id AS VARCHAR) WHERE t.id_day_training = $1";

  try {
    const result = await cliente.query(query, [idDayTraining]);
    res.status(200).json({
      message: "Treinamentos recuperados com sucesso!",
      data: result.rows,
    });
  } catch (err) {
    console.error("Erro ao recuperar treinamentos:", err);
    res
      .status(500)
      .json({ error: "Erro ao recuperar treinamentos no banco de dados." });
  }
});

router.put("/editSeries", async (req, res) => {
  const { id } = req.query;
  const { series } = req.body;
  console.log(id, series);
  const query = "UPDATE training SET series = $1 WHERE id = $2";
  try {
    const result = await cliente.query(query, [series, id]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Erro ao atualizar séries:", err);
    res
      .status(500)
      .json({ error: "Erro ao atualizar as séries no banco de dados." });
  }
});

router.put("/editCarga", async (req, res) => {
  const { id } = req.query;
  const { carga } = req.body;
  const query = "UPDATE training SET carga = $1 WHERE id = $2";
  try {
    const result = await cliente.query(query, [carga, id]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Erro ao atualizar séries:", err);
    res
      .status(500)
      .json({ error: "Erro ao atualizar as séries no banco de dados." });
  }
});

router.put("/editIntervalo", async (req, res) => {
  const { id } = req.query;
  const { intervalo } = req.body;
  const query = "UPDATE training SET intervalo = $1 WHERE id = $2";
  try {
    const result = await cliente.query(query, [intervalo, id]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Erro ao atualizar séries:", err);
    res
      .status(500)
      .json({ error: "Erro ao atualizar as séries no banco de dados." });
  }
});

module.exports = router;
