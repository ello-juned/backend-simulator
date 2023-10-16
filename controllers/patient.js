const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const csv = require("csv-parse");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const addPatient = async (req, res) => {
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
          full_name: first_name + last_name,
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
    const csvDataString = uploadedFile.buffer.toString();
    const data = [];

    csv
      .parse(csvDataString, { headers: true })
      .on("data", (row) => {
        data.push(row);
      })
      .on("end", () => {
        const insertPatients = async () => {
          const onlyKeys = data[0].map((key) => key.trim()); // keys
          const onlyValues = data.slice(1); // values
          const newPatientsList = [];

          try {
            for (const values of onlyValues) {
              const finalPatient = {};

              for (let index = 0; index < onlyKeys.length; index++) {
                const key = onlyKeys[index];

                // validating zip_code lenth for 8---
                if (key === "zip_code") {
                  const zipCode = values[index];
                  if (zipCode.length !== 8) {
                    // Return an error if zip_code is not 8 characters long
                    return res
                      .status(401)
                      .json({ message: "Invalid zip code format" });
                  }
                  finalPatient[key] = zipCode;
                } else {
                  if (key === "age") {
                    finalPatient[key] = parseInt(values[index], 10);
                  } else {
                    finalPatient[key] = values[index];
                  }
                  // Create 'full_name' by combining 'first_name' and 'last_name'
                  if (finalPatient.first_name && finalPatient.last_name) {
                    finalPatient.full_name =
                      finalPatient.first_name + finalPatient.last_name;
                  }
                }
              }

              newPatientsList.push(finalPatient);
            }

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
                error.meta.target === "patients_email_key" ||
                error.meta.target === "patients_phone_key" ||
                error.meta.target === "patients_nhs_number_key"
              ) {
                res.status(401).json({
                  message:
                    "Patient email, phone, and nhs_number should be unique",
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
const getPatient = async (req, res) => {
  try {
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

  const query = req.body.Query.trim().replace(/\s/g, ""); // removed whitespaces---

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
          { gender: { contains: query } },
          { nhs_number: { contains: query } },
          { phone: { contains: query } },
          { zip_code: { contains: query } },
          {
            OR: [
              { first_name: { contains: query } },
              { last_name: { contains: query } },
            ],
          },
          {
            AND: [
              { first_name: { contains: query.split(" ")[0] } },
              { last_name: { contains: query.split(" ")[1] } },
            ],
          },
          {
            full_name: { contains: query },
          },
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
  const patientId = parseInt(req.body.id);
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

// searching Multiple patientss---
// search for two  fields---
//

const searchMultiplePatient = async (req, res) => {
  const userQuery = req.body.data;

  const a = userQuery?.fQuery?.split(",");
  const b = userQuery?.sQuery?.split(",");

  // user Inputs from first field---
  const fullName = a?.[0];
  const dob = a?.[1];
  const nhsNumber = a?.[2];

  // user Inputs from second field---

  const address = b?.[0];
  const street = b?.[1];
  const phone = b?.[2];

  // query from user side---
  if (a === undefined && b === undefined) {
    return res.status(400).json({ message: "No search criteria provided." });
  }

  try {
    const patients = await prisma.patients.findMany({
      where: {
        OR: [
          fullName
            ? {
                OR: [
                  { first_name: { contains: fullName } },
                  { last_name: { contains: fullName } },
                ],
              }
            : null,
          dob ? { date_of_birth: { contains: dob } } : null,
          nhsNumber ? { nhs_number: { contains: nhsNumber } } : null,
          address ? { address: { contains: address } } : null,
          street ? { street: { contains: street } } : null,
          phone ? { phone: { contains: phone } } : null,
        ].filter(Boolean),
      },
    });

    res.status(202).json({ patients, message: "Patients Found!" });
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ message: "Something went wrong while searching!" });
  }
};

//user registration---
const userRegistration = async (req, res) => {
  const { name, email, password } = req.body;

  // user creation time---
  const createdAt = new Date();

  // hasing password---
  const hashedPass = await bcrypt.hash(password, 10);
  const payload = {
    name,
    email,
    password: hashedPass,
    created_at: createdAt,
  };

  try {
    const user = await prisma.users.create({
      data: payload,
    });
    res
      .status(201)
      .json({ user, message: "User created succesfully.", isLoggedIn: true });
  } catch (error) {
    if (error) {
      res.status(401).json({ message: "Please check credentials" });
    }
  }
};

//user registration---
const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.users.findUnique({
      where: { email },
    });
    if (!user) {
      res
        .status(400)
        .json({ user, message: "User not found. check credentials" });
    } else {
      // comparing both password---
      const comparePass = await bcrypt.compare(password, user.password);
      if (!comparePass) {
        res
          .status(401)
          .json({ message: "Invalid password.", isLoggedIn: false });
      } else {
        // Generate a JWT token for authentication
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
          expiresIn: "1h", // Token expiration time
        });

        res.json({ token });

        res.status(200).json({
          user,
          message: "User logggIn succesfully.",
          isLoggedIn: true,
        });
      }
    }
  } catch (error) {
    if (error) {
      res
        .status(401)
        .json({ message: "Please check credentials", isLoggedIn: false });
    }
  }
};
module.exports = {
  addPatient,
  getPatient,
  searchPatient,
  getSinglePatient,
  updateSinglePatient,
  deleteSinglePatient,
  searchMultiplePatient,
  userRegistration,
  userLogin,
};
