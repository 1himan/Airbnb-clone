if (process.env.NODE_ENV != "production") require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const fetch = require("node-fetch");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const filterRouter = require("./routes/filter.js");
const userRouter = require("./routes/user.js");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const ExpressError = require("./utils/ExpressError.js");
const Listing = require("./models/listing.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/Public")));
const sessionOptions = {
  secret: "itsMySecretCode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/screens");
}

app.listen(8001, () => {
  console.log("App is listening on port 8001");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(express.json());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.post("/listings/:id/map", async (req, res) => {
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

  async function geocode(address) {
    const response = await fetch(
      `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(
        address
      )}&apiKey=h6Oeq0Ftw3TTcHUOwoBQYymt2JXR85-6WwIDudh5sQg`
    );

    const data = await response.json();
    if (data.items && data.items.length > 0) {
      const location = data.items[0].position;
      return { latitude: location.lat, longitude: location.lng };
    } else {
      throw new Error("No results found for that address.");
    }
  }

  let userLocation;
  let location = req.body.listing.location;
  if (location.startsWith("Latitude:")) {
    let data = req.body;
    let location = data.listing.location;
    let parts = location.split(",");
    let latitudePart = parts[0];
    let longitudePart = parts[1];
    let latitude = parseFloat(latitudePart.split(":")[1].trim());
    let longitude = parseFloat(longitudePart.split(":")[1].trim());
    userLocation = { latitude, longitude };
    console.log(userLocation);
  } else {
    // Geocode the address
    try {
      let userlocation = await geocode(location);
      userLocation = userlocation;
      console.log(userLocation);
    } catch (error) {
      console.error("Error with the geocoding request:", error);
    }
  }

  res.render("listings/map.ejs", { listing, userLocation });
  // res.send("This is a basic response");
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/listings/filter", filterRouter);
app.use("/", userRouter);

//* ERROR HANDELING MIDDLEWARES
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  let { status = 500, message = "An Error Occured" } = err;
  // res.status(status).send(message);
  res.status(status).render("listings/error.ejs", { err });
});
