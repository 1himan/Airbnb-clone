const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const {
  index,
  showListing,
  createListing,
  editListing,
  updateListing,
  deleteListing,
} = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const Listing = require("../models/listing.js");
const upload = multer({ storage });

//* Root Route
router
  .route("/")
  .get(wrapAsync(index))
  .post(isLoggedIn, upload.single("listing[image]"), wrapAsync(createListing));

//* NEW ROUTE
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

//* SHOW ROUTE
router
  .route("/:id")
  .get(wrapAsync(showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    wrapAsync(updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(deleteListing));

//* EDIT ROUTE
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(editListing));

//* SEARCH
router.post("/search", async (req, res) => {
  console.log(req.body.searchTerm);

  let allListings;
  try {
    // First, attempt to find by country
    allListings = await Listing.find({ country: req.body.searchTerm });

    // If no listings found, attempt to find by location
    if (allListings.length === 0) {
      allListings = await Listing.find({ location: req.body.searchTerm });
    }

    res.render("listings/index.ejs", { allListings });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
