const express = require("express");
const cors = require("cors");
const checkDatabaseConnection = require("./connections/connectiondb");
const router = require("./routes/patient");

const PORT = process.env.PORT || 5501;
const app = express();

app.use(express.json());
app.use(cors());
app.use(router);

/// checking Database connection....
checkDatabaseConnection();

// Listening on port 5501
app.listen(PORT, () => {
  console.log(`Backend listening on ${PORT}`);
});
