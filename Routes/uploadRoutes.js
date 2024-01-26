const express = require("express");
const path = require('path');
const multer = require('multer');
const router = express.Router();
const { createConnection } = require("../config/config");
const cliente = createConnection();

const storage = multer.diskStorage({
  destination: "./media/",
  filename: function (req, file, cb) {
    cb(null,  file.originalname);
  },
});

const diskStorage = multer({ storage: storage });

router.post("/photo", diskStorage.single("file"), async (req, res) => {
  try {
    const { originalname } = req.file;
    const { userId, typeUser } = req.body;
    const query = `UPDATE ${typeUser} set photo = $1 WHERE id = $2`;
    const result = await cliente.query(query, [originalname, userId]);
    res.status(201).json({ message: "Imagem alterada com sucesso!" });
  } catch (error) {
    res.status(500).send("Error");
  }
});

module.exports = router;
