const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

const corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));
app.use(cors());
app.use(express.json());

const port = process.env.PORT;

const userRoutes = require("./Routes/userRoutes");
const routineRoutes = require("./Routes/routineRoutes");
const typeRoutine = require("./Routes/typeRoutine");
const exerciseRoutes = require("./Routes/exerciseRoutes");
const trainingRoutes = require("./Routes/trainingRoutes");
const pdfRoutes = require("./Routes/savePdfRoutes");
const uploadRoutes = require("./Routes/uploadRoutes");
app.use("/user", userRoutes);
app.use("/routine", routineRoutes);
app.use("/type", typeRoutine);
app.use("/exercise", exerciseRoutes);
app.use("/training", trainingRoutes);
app.use("/pdf", pdfRoutes);
app.use("/upload", uploadRoutes);


app.use('/media', express.static('./uploads'));

app.listen(port, () => {
  console.log(`Servidor está ouvindo na porta ${port}`);
});
