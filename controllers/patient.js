const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const csv = require("csv-parse");

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
            const newPatients = await prisma.patient.createMany({
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
    const pateints = await prisma.patient.findMany({
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
      message: "search completed!",
    });
  } catch (error) {
    console.log("error", error);
    res.status(400).json({ message: "something Error in searching!" });
  }
};

module.exports = { addPatient, getPatient, searchPatient };
