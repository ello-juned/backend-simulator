const express = require("express");
const cors = require("cors");

const PORT = 5500;
const app = express();

app.use(express.json());

app.use(cors());

//  API Endpoint for add new Patient---
app.post("/add-patient", (req, res) => {
  console.log(req.body);
  res.send("add-patient hitted!!");

  console.log("add-patient hitted!!");
});

//  API Endpoint for get Patients---
app.get("/patients-data", (req, res) => {
  res.send("get-patients hitted!!");
  console.log("get-patients hitted!!");
});

app.listen(PORT, () => {
  console.log(`backend listening on ${PORT}`);
});
