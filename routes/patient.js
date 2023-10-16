const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  addPatient,
  getPatient,
  searchPatient,
  getSinglePatient,
  updateSinglePatient,
  deleteSinglePatient,
  userRegistration,
  userLogin,
  searchMultiplePatient,
} = require("../controllers/patient");
const storage = multer.memoryStorage();
const upload = multer({ storage });

// add new patient--
// using form or direct upload CSV file---
router.post("/add-patient", upload.single("csvFile"), addPatient);

// retrieving patients data
//with pagination
router.get("/patients-data", getPatient);

// serahcing based on ["last_name","gender","age","email","phone","date_of_birth","address","city","country","zip_code","nhs_number"],

router.post("/search-patient", searchPatient);

// get a patients by ID--
router.post("/getSingle-Patient", getSinglePatient);

// update a patients by ID--
router.put("/updateSingle-Patient", updateSinglePatient);

// update a patients by ID--
router.delete("/deleteSingle-Patient", deleteSinglePatient);

//router.post("/search-patient", searchPatient);

router.post("/searchMultiple-patient", searchMultiplePatient);

// user Registration---
router.post("/user-Registration", userRegistration);

// user Registration---
router.post("/user-Login", userLogin);

module.exports = router;
