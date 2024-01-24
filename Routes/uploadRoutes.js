const express = require("express");
const path = require('path');
const multer = require('multer');
const router = express.Router();
const { createConnection } = require("../config/config");

const uploadDir = './uploads';
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const fileExtension = path.extname(file.originalname);
    const newFileName = `${timestamp}${fileExtension}`;
    cb(null, newFileName);
  },
});

const upload = multer({ storage: storage });
router.post('/photo', upload.single('file'), (req, res) => {
  const file = req.file;
  const { email, isTeacher } = req.body;
  const table = isTeacher ? "teacher" : "student";
  console.log('veja', file)
  try {
  const query = `UPDATE ${table} set photo = $1 WHERE email = $2`;
  const cliente = createConnection();

  res.status(200).json({message: "sucesso"});
    
  } catch (error) {
    res.status(500).send("Erro interno do servidor");
    
  }

  res.json({ message: 'Arquivo recebido e salvo com sucesso' });
});




module.exports = router;
