const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  addPatient,
  getPatient,
  searchPatient,
} = require("../controllers/patient");
const storage = multer.memoryStorage();
const upload = multer({ storage });

// add new patient--
// using form or direct upload CSV file---
router.post("/add-patient", upload.single("csvFile"), addPatient);

// retrieving patients data
//with pagination
router.get("/patients-data", getPatient);

// serahcing based on [''name','email','mobile', 'nhs_number']
router.post("/search-patient", searchPatient);

module.exports = router;