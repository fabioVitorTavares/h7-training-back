const express = require("express");
const router = express.Router();
const { createConnection } = require("../config/config");

router.post("/verificaUsuario", (req, res) => {
  const { email, senha, isTeacher } = req.body;
  const table = isTeacher ? "teacher" : "student";
  const query = `SELECT * FROM ${table} WHERE email = $1 and password = $2`;
  const cliente = createConnection();
  cliente
    .query(query, [email, senha])
    .then((results) => {
      const usuario = results.rows[0];
      if (usuario) {
        res.status(200).json(usuario);
      } else {
        res.status(201).send("Usuário não encontrado");
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Erro interno do servidor");
    });
});

router.post("/registerTeacher", async (req, res) => {
  const { email, password, firstName, lastName, phone } = req.body;
  const connection = createConnection();

  // Verifica se o e-mail já está cadastrado
  connection.query(
    "SELECT * FROM teacher WHERE email = $1",
    [email],
    (selectErr, selectResult) => {
      if (selectErr) {
        console.error("Erro ao verificar a existência do e-mail:", selectErr);
        res
          .status(500)
          .json({ error: "Erro ao verificar a existência do e-mail." });
      } else if (selectResult.rows.length > 0) {
        // Se o e-mail já existe, retorna um erro personalizado
        res.status(400).json({ error: "E-mail já cadastrado." });
      } else {
        // Se o e-mail não existe, realiza a inserção
        connection.query(
          "INSERT INTO teacher (email, password, firstName, lastName, phone) VALUES ($1, $2, $3, $4, $5)",
          [email, password, firstName, lastName, phone],
          (insertErr, insertResult) => {
            if (insertErr) {
              console.error("Erro ao inserir os dados:", insertErr);
              res
                .status(500)
                .json({ error: "Erro ao inserir os dados no banco de dados." });
            } else {
              console.log("Usuário cadastrado com sucesso!");
              res
                .status(201)
                .json({ message: "Usuário cadastrado com sucesso!" });
            }
          }
        );
      }
    }
  );
});

router.post("/registerStudent", async (req, res) => {
  const {
    firstName,
    lastName,
    grouptype,
    phone,
    datanascimento,
    genero,
    email,
    idTeacher,
  } = req.body;
  const password = "1234";
  const connection = createConnection();
  connection.query(
    "INSERT INTO student (firstName, lastName, password, grouptype, phone, datanascimento, genero, email, idTeacher) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
    [
      firstName,
      lastName,
      password,
      grouptype,
      phone,
      datanascimento,
      genero,
      email,
      idTeacher,
    ],
    (err, result) => {
      if (err) {
        console.error("Erro ao inserir os dados:", err);
        res
          .status(500)
          .json({ error: "Erro ao inserir os dados no banco de dados." });
      } else {
        console.log("Usuário cadastrado com sucesso!");
        res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
      }
    }
  );
});

router.put("/studentPerfil", async (req, res) => {
  const {
    firstName,
    lastName,
    photo,
    idStudent
  } = req.body;
  const connection = createConnection();
  connection.query(
    "Update student set firstName = $1, lastName = $2, phone = $3 where id = $4",
    [
      firstName,
      lastName,
      photo,
      idStudent
    ],
    (err, result) => {
      if (err) {
        console.error("Erro ao editar os dados:", err);
        res
          .status(500)
          .json({ error: "Erro ao editar os dados no banco de dados." });
      } else {
        console.log("Usuário editado com sucesso!");
        res.status(201).json({ message: "Usuário editado com sucesso!" });
      }
    }
  );
});

router.put("/teacherPerfil", async (req, res) => {
  const {
    firstName,
    lastName,
    photo,
    idTeacher
  } = req.body;
  const connection = createConnection();
  connection.query(
    "Update teacher set firstName = $1, lastName = $2, phone = $3 where id = $4",
    [
      firstName,
      lastName,
      photo,
      idStudent
    ],
    (err, result) => {
      if (err) {
        console.error("Erro ao editar os dados:", err);
        res
          .status(500)
          .json({ error: "Erro ao editar os dados no banco de dados." });
      } else {
        console.log("Usuário editado com sucesso!");
        res.status(201).json({ message: "Usuário editado com sucesso!" });
      }
    }
  );
});

router.delete("/deleteStudent", async (req, res) => {
  const { idStudent  } = req.query;
  const connection = createConnection();
  console.log({ idStudent, body:req.body, query:req.query, params: req.params, header: req.header  });
  connection.query(
    "DELETE FROM student where id = $1",
    [
      idStudent,
    ],
    (err, result) => {
      if (err) {
        console.error("Erro ao apagar aluno", err);
        res
          .status(500)
          .json({ error: "Erro ao apagar aluno no banco de dados." });
      } else {
        console.log("Usuário apagado com sucesso!");
        res.status(201).json({ message: "Usuário apagado com sucesso!" });
      }
    }
  );
});

router.put("/changePasswordStudent", async (req, res) => {
  const { idStudent, currentPassword, newPassword } = req.body;
  const connection = createConnection();

  // Verificar se a senha atual está correta
  const checkPasswordQuery =
    "SELECT * FROM student WHERE id = $1 AND password = $2 LIMIT 1";

  connection.query(
    checkPasswordQuery,
    [idStudent, currentPassword],
    (err, result) => {
      if (err) {
        console.error("Erro ao verificar a senha atual:", err);
        res.status(500).json({ error: "Erro ao verificar a senha atual." });
      } else {
        if (result.rows.length === 0) {
          // Se a senha atual estiver incorreta
          res.status(401).json({ error: "Senha atual incorreta." });
        } else {
          // A senha atual está correta, então podemos atualizar a senha
          const updatePasswordQuery =
            "UPDATE student SET password = $1 WHERE id = $2";

          connection.query(
            updatePasswordQuery,
            [newPassword, idStudent],
            (err, updateResult) => {
              if (err) {
                console.error("Erro ao atualizar a senha:", err);
                res.status(500).json({
                  error: "Erro ao atualizar a senha no banco de dados.",
                });
              } else {
                console.log("Senha atualizada com sucesso!");
                res.status(200).json({ success: true });
              }
            }
          );
        }
      }
    }
  );
});

router.get("/getStudents", async (req, res) => {
  const { idTeacher } = req.query;
  const connection = createConnection();
  // Consulta SQL para obter alunos com base no idTeacher
  const query = "SELECT * FROM student WHERE idteacher = $1";

  connection.query(query, [idTeacher], (err, result) => {
    if (err) {
      console.error("Erro ao obter os dados:", err);
      res
        .status(500)
        .json({ error: "Erro ao obter os dados do banco de dados." });
    } else {
      console.log("Alunos obtidos com sucesso!");
      res.status(200).json({ students: result.rows });
    }
  });
});

router.get("/getStudentIdStudent", async (req, res) => {
  const { idStudent } = req.query;
  const connection = createConnection();

  // Consulta SQL para obter um único aluno com base no idStudent
  const query = "SELECT * FROM student WHERE id = $1 LIMIT 1";

  connection.query(query, [idStudent], (err, result) => {
    if (err) {
      console.error("Erro ao obter os dados:", err);
      res
        .status(500)
        .json({ error: "Erro ao obter os dados do banco de dados." });
    } else {
      if (result.rows.length === 0) {
        // Se nenhum aluno for encontrado com o id fornecido
        res.status(404).json({ error: "Estudante não encontrado." });
      } else {
        console.log("Estudante obtido com sucesso!");
        res.status(200).json({ student: result.rows[0] });
      }
    }
  });
});

router.get("/getStudentByRoutine", async (req, res) => {
  const { idRoutine } = req.query;
  const connection = createConnection();

  // Consulta SQL para obter o valor de idStudent da rotina com base no idRoutine
  const routineQuery = "SELECT idStudent FROM Routine WHERE id_routine = $1";

  connection.query(routineQuery, [idRoutine], (routineErr, routineResult) => {
    if (routineErr) {
      console.error(
        "Erro ao obter o valor de idStudent da rotina:",
        routineErr
      );
      res
        .status(500)
        .json({ error: "Erro ao obter os dados do banco de dados." });
    } else {
      // Verifica se um valor de idStudent foi encontrado
      if (
        routineResult.rows.length === 0 ||
        routineResult.rows[0].idStudent === null
      ) {
        res
          .status(404)
          .json({ error: "Estudante não encontrado para esta rotina." });
      } else {
        const idStudent = routineResult.rows[0].idstudent;
        // Consulta SQL para obter as informações do estudante com base no idStudent
        const studentQuery = "SELECT * FROM student WHERE id = $1";

        connection.query(
          studentQuery,
          [idStudent],
          (studentErr, studentResult) => {
            if (studentErr) {
              console.error("Erro ao obter os dados do estudante:", studentErr);
              res
                .status(500)
                .json({ error: "Erro ao obter os dados do banco de dados." });
            } else {
              if (studentResult.rows.length === 0) {
                res.status(404).json({ error: "Estudante não encontrado." });
              } else {
                res.status(200).json({ student: studentResult.rows[0] });
              }
            }
          }
        );
      }
    }
  });
});

module.exports = router;
