const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const csv = require("csv-parse");

// add new patient or
// multiple patients using CSV uploads--
const addPatient = async (req, res) => {
  // Access the uploaded file via req.file
  const uploadedFile = req.file;

  // when patient is added by form---
  if (!uploadedFile && req.body) {
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
      const newPatient = await prisma.patients.create({
        data: {
          ...bodyData,
        },
      });

      res.status(201).json({
        message: "Patient created succesfully",
        newPatient,
      });
    } catch (error) {
      console.log("error", error);
      if (error?.meta) {
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
  } else {
    // when patient is added by csv file---

    // Convert the buffer to a string
    const csvDataString = uploadedFile.buffer.toString();
    // Create an empty array to store the parsed data
    const data = [];

    // Use csv-parser to read and parse the CSV data from the string
    csv
      .parse(csvDataString, { headers: true })
      .on("data", (row) => {
        // Process each row of data here

        data.push(row);
      })
      .on("end", () => {
        const insertPatients = async () => {
          const onlyKeys = data[0].map((key) => key.trim()); // keys
          const onlyValues = data.slice(1); // values
          // create patients objects ---
          const newPatientsList = onlyValues.map((values) => {
            const finalPatient = {};

            onlyKeys.forEach((key, index) => {
              if (key === "age") {
                // Parse 'age' as an integer
                finalPatient[key] = parseInt(values[index], 10);
              } else {
                finalPatient[key] = values[index];
              }
            });

            return finalPatient;
          });

          try {
            const newPatients = await prisma.patients.createMany({
              data: newPatientsList,
              skipDuplicates: false,
            });

            res.status(201).json({
              message: "Patients created successfully",
              newPatients,
            });
          } catch (error) {
            console.log("error.meta.target", error);
            if (error.meta.target) {
              if (
                error.meta.target === "Patient_email_key" ||
                "Patient_phone_key" ||
                "Patient_nhs_number_key"
              ) {
                res.status(401).json({
                  message:
                    "Patient email , phone and nhs_number should be unique",
                });
              }
            } else {
              res.status(401).json({
                message: "Something went Wrong!",
              });
            }
          }
        };

        insertPatients();
      });
  }
};

// getting patinets
// 10 patients per page, with pagination
const getPatient = async (req, res) => {
  try {
    // getting page No fro pagination---
    const currentPage = req.query.currentPage ? req.query.currentPage : 1;
    // limit perpage  patients---

    const perPage = 10;
    // skipping
    const skip = (currentPage - 1) * perPage;

    // total pateints in database table---
    const totalPatients = await prisma.patients.count();

    // Fetch patients data using Prisma with pagination
    const patients = await prisma.patients.findMany({
      skip,
      take: perPage,
    });
    console.log("totalPatients", totalPatients);
    res.status(200).json({
      patients,
      totalPatients,
      message: "succesfully patients loaded!",
    });
  } catch (error) {
    console.error("Error fetching patients data:", error);
    res.status(500).json({ error: "Error fetching patients data" });
  }
};

// search api
// serahcing based on [''name','email',....more]

const searchPatient = async (req, res) => {
  // query from user side---
  const query = req.body.Query;
  if (!query) {
    return;
  }

  try {
    const pateints = await prisma.patients.findMany({
      where: {
        OR: [
          { address: { contains: query } },
          { city: { contains: query } },
          { country: { contains: query } },
          { date_of_birth: { contains: query } },
          { email: { contains: query } },
          { last_name: { contains: query } },
          { gender: { contains: query } },
          { nhs_number: { contains: query } },
          { first_name: { contains: query } },
          { phone: { contains: query } },
          { zip_code: { contains: query } },
        ],
      },
    });
    res.status(202).json({
      pateints,
    });
  } catch (error) {
    console.log("error", error);
    res.status(400).json({ message: "something Error in searching!" });
  }
};

// get a patients by ID--
const getSinglePatient = async (req, res) => {
  const patientId = await parseInt(req.body.id);
  try {
    if (patientId) {
      const patient = await prisma.patients.findUnique({
        where: {
          id: patientId,
        },
      });
      await res
        .status(200)
        .json({ patient, message: "patient succesfully  loaded." });
    }
  } catch (error) {
    console.log("error in sinle", error);
    res.status(400).json({ message: "Invalid Id OR patient not found!" });
  }
};

// get a patients by ID--
const updateSinglePatient = async (req, res) => {
  const patientId = parseInt(req.body.id);
  const data = ({
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

  try {
    if (!isNaN(patientId)) {
      // Check if patientId is a valid number
      const updatedPatient = await prisma.patients.update({
        where: {
          id: patientId,
        },
        data: {
          ...data,
        },
      });

      res
        .status(200)
        .json({ updatedPatient, message: "Patient successfully updated." });
    } else {
      res.status(400).json({ message: "Invalid ID!" });
    }
  } catch (error) {
    console.log("error", error);
    if (error.meta) {
      res.status(400).json({
        message: "Patient email , phone and nhs_number should be unique",
      });
    }
    // res.status(500).json({ message: "Error updating patient." });
  }
};

// delete a patients by ID--
const deleteSinglePatient = async (req, res) => {
  const patientId = req.body.id;

  try {
    if (!isNaN(patientId)) {
      // Check if patientId is a valid number
      const deletedPatient = await prisma.patients.delete({
        where: {
          id: patientId,
        },
      });

      res.status(200).json({ message: "Patient successfully deleted." });
    } else {
      res.status(400).json({ message: "Invalid ID!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting patient." });
  }
};

module.exports = {
  addPatient,
  getPatient,
  searchPatient,
  getSinglePatient,
  updateSinglePatient,
  deleteSinglePatient,
};
