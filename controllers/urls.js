const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// creating new URL---
// every URL should be Unique----
const addURL = async (req, res) => {
  // {name, url} from req.body---
  const data = req.body;

  try {
    await prisma.urls.create({
      data: {
        ...data,
      },
    });
    res.status(201).json({ message: "Url created succesfully" });
  } catch (error) {
    if (error.meta.target) {
      res.status(401).json({ message: "Duplicate Url" });
    } else {
      res.status(401).json({ message: "Error on adding new Url" });
    }
  }
};

// retrieving  URLs---
//pagination added---
const getURLs = async (req, res) => {
  const currentPage = req.query.currentPage ? req.query.currentPage : 1;
  try {
    // limit perpage  URLs---
    const perPage = 10;
    // skipping
    const skip = (currentPage - 1) * perPage;

    // total pateints in database table---
    const totalUrls = await prisma.urls.count();

    const urls = await prisma.urls.findMany({ skip, take: perPage });
    res
      .status(200)
      .json({ urls, totalUrls, message: "Urls fetched succesfully." });
  } catch (error) {
    if (error) {
      res.status(400).json({ message: "errr efetching urls" });
    }
  }
};

// deleting a URL by ID---
const deleteSingleUrl = async (req, res) => {
  const url_ID = req.body.id;

  try {
    if (!isNaN(url_ID)) {
      // Check if url_ID is a valid number
      await prisma.urls.delete({
        where: {
          id: url_ID,
        },
      });

      res.status(200).json({ message: "Url successfully deleted." });
    } else {
      res.status(400).json({ message: "Invalid ID!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting Url." });
  }
};
module.exports = {
  addURL,
  getURLs,
  deleteSingleUrl,
};
