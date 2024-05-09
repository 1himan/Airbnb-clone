const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews.js");

// If the value is an object that contains properties like type
// ,required, default, etc., Mongoose interprets this as a field definition.
// For example, in the case of title, the value is an object { type: String, required: true }
// ,which tells Mongoose that title is a field of type String and it’s required.
// If the value is an object that does not contain any of the special properties
// recognized by Mongoose (like type, required, etc.), then Mongoose treats this as
// a nested object or subdocument. For example, in the case of image, the value is
// an object { url: String, filename: String }, which tells Mongoose that image is
// a subdocument with its own fields url and filename
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  category: {
    type: String,
    enum: [
      "City",
      "Beach",
      "Mountain",
      "Historical",
      "Luxury",
      "Family-friendly",
      "Rooms",
      "Camping",
      "Skiing",
      "Cold",
    ],
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
