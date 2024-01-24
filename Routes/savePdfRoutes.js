const express = require("express");
const router = express.Router();
const { createConnection } = require("../config/config");
const cliente = createConnection();



router.post("/createNutrition", async (req, res) => {
    const { pdf, idStutdent } = req.body; // Receba o nome do tipo do corpo da solicitação

  
    const query = `INSERT INTO Nutrition (pdf, idEstudante) VALUES ($1, $2)`;
  
    try {
      const result = await cliente.query(query, [pdf, idStutdent]);
      res.status(201).json({ message: "Nutrição cadastrada com sucesso!" });
    } catch (err) {
      console.error("Erro ao inserir nutrição:", err);
      res
        .status(500)
        .json({ error: "Erro ao inserir a nutrição no banco de dados." });
    }
});

router.get("/getNutrition", async (req, res) => {
    const {  idStutdent } = req.query; // Receba o nome do tipo do corpo da solicitação

    console.log(idStutdent)
    const query = `select * from  Nutrition where idestudante = $1 order by id desc LIMIT 1`;
  
    try {
      const result = await cliente.query(query, [idStutdent]);
      console.log(result)
      res.status(201).json(result.rows);
    } catch (err) {
      console.error("Erro ao inserir nutrição:", err);
      res
        .status(500)
        .json({ error: "Erro ao inserir a nutrição no banco de dados." });
    }

});
  module.exports = router;