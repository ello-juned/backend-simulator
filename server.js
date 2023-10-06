const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const PORT = 5501;
const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

// API Endpoint for adding a new Patient
app.post("/add-patient", async (req, res) => {
  try {
    const bodyData = ({
      first_name,
      last_name,
      gender,
      age,
      email,
      phone,
      date_of_birth,
      address,
      city,
      country,
      zip_code,
      nhs_number,
    } = req.body);

    // Create a new patient using Prisma
    const newPatient = await prisma.patient.create({
      data: {
        ...bodyData,
      },
    });

    res.status(201).json({
      message: "Patient created succesfully",
      newPatient,
    });
  } catch (error) {
    if (error.meta.target) {
      if (
        error.meta.target === "Patient_email_key" ||
        "Patient_phone_key" ||
        "Patient_nhs_number_key"
      ) {
        res.status(401).json({
          message: "Patient email , phone and nhs_number should be unique",
        });
      }
    } else {
      res.status(401).json({
        message: "Something went Wrong!",
      });
    }
  }
});

// API Endpoint for getting Patients
app.get("/patients-data", async (req, res) => {
  try {
    // getting page No fro pagination---
    const currentPage = req.query.currentPage ? req.query.currentPage : 1;
    // limit perpage  patients---

    const perPage = 10;
    // skipping
    const skip = (currentPage - 1) * perPage;

    // total pateints in database table---
    const totalPatients = await prisma.patient.count();

    // Fetch patients data using Prisma with pagination
    const patients = await prisma.patient.findMany({
      skip,
      take: perPage,
    });

    res.status(200).json({
      patients,
      totalPatients,
      message: "succesfully patients loaded!",
    });
  } catch (error) {
    console.error("Error fetching patients data:", error);
    res.status(500).json({ error: "Error fetching patients data" });
  }
});

/// checking Database connection....
async function checkDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log("Database connection is successful");
  } catch (error) {
    console.error("Database connection error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabaseConnection();

app.listen(PORT, () => {
  console.log(`Backend listening on ${PORT}`);
});
