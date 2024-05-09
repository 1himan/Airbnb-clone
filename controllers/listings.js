const Listing = require("../models/listing");

//* For INDEX ROUTE
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

//* For CREATE ROUTE
module.exports.createListing = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;

  const fields = {
    title: "Please enter a title",
    description: "Please enter a description",
    price: "Please enter a price",
    country: "Please enter your country name",
    location: "Please enter a location",
  };

  if (!req.body.listing) {
    throw new ExpressError(400, "Send Valid Data for list");
  }

  for (let field in fields) {
    if (!req.body.listing[field]) {
      throw new ExpressError(400, fields[field]);
    }
  }

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.category = req.body.listing.category; // Add the random category to the listing
  await newListing.save();

  req.flash("success", "New Listing Created Successfully !");
  res.redirect("/listings");
};

//* For SHOW ROUTE
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "The Listing You Requested For Does Not Exist");
    res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

//* For EDIT ROUTE
module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "The Listing You Requested For Does Not Exist");
    res.redirect("/listings");
  }

  let originalUrl = listing.image.url;
  originalUrl = originalUrl.replace("/upload", "/upload/h_250,w_250");

  res.render("listings/edit", { listing, originalUrl });
};

//* For UPDATE ROUTE
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing Updated successfully");
  res.redirect(`/listings/${id}`);
};

//* For DELETE ROUTE
module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted successfully");
  res.redirect("/listings");
};
