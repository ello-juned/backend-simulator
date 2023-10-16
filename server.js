const express = require("express");
const cors = require("cors");
const checkDatabaseConnection = require("./connections/connectiondb");
const patientRouter = require("./routes/patient");
const urlsRouter = require("./routes/urls");

const PORT = process.env.PORT || 5501;
const app = express();

app.use(express.json());
app.use(cors());
app.use(patientRouter);
app.use(urlsRouter);

/// checking Database connection....
checkDatabaseConnection();

// Listening on port 5501
app.listen(PORT, () => {
  console.log(`Backend listening on ${PORT}`);
});
