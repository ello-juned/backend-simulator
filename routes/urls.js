const express = require("express");
const { addURL, getURLs, deleteSingleUrl } = require("../controllers/urls");
const router = express.Router();

router.post("/add-Url", addURL);
router.get("/get-Urls", getURLs);
router.delete("/deleteSingle-Url", deleteSingleUrl);

module.exports = router;
