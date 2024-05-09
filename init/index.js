const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/screens");
}

const categories = [
  "City",
  "Beach",
  "Mountain",
  "Historical",
  "Luxury",
  "Family-Friendly",
  "Rooms",
  "Camping",
  "Skiing",
  "Cold",
];

const initDB = async () => {
  await Listing.deleteMany({});

  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "6613bfc1e852829269e32fb8",
    category: categories[Math.floor(Math.random() * categories.length)], // Add a random category
  }));

  await Listing.insertMany(initData.data);
  console.log("Data was initialized");
};

initDB();
