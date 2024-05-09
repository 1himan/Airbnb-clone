const express = require("express");
const router = express.Router();

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const Listing = require("../models/listing.js");

//* FILTER
router.get("/:category", async (req, res) => {
  console.log(req.params);

  let allListings;
  try {
    // Find listings by category
    allListings = await Listing.find({ category: req.params.category });

    // Render the index.ejs view with the filtered listings
    res.render("listings/index.ejs", { allListings });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

//* ADVANCE FILTER
router.post("/advance", async (req, res) => {
  console.log(req.body);

  let allListings;
  try {
    // Create a filter object
    let filter = {};

    // Add properties to the filter object based on the request body
    if (req.body.listing.title) filter.title = req.body.listing.title;
    if (req.body.listing.category !== "Choose...")
      filter.category = req.body.listing.category;
    if (req.body.listing.budgetType !== "Choose...") {
      if (req.body.listing.budgetType === "under") {
        filter.price = { $lte: req.body.listing.price };
      } else {
        filter.price = { $gte: req.body.listing.price };
      }
    }
    if (req.body.listing.country) filter.country = req.body.listing.country;
    if (req.body.listing.location) filter.location = req.body.listing.location;

    // Find listings by filter
    allListings = await Listing.find(filter);

    // Render the index.ejs view with the filtered listings
    res.render("listings/index.ejs", { allListings });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
