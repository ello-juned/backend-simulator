const express = require("express");
const router = express.Router();
const multer = require("multer");
const { addPatient, getPatient } = require("../controllers/patient");
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/add-patient", upload.single("csvFile"), addPatient);

router.get("/patients-data", getPatient);

module.exports = router;
