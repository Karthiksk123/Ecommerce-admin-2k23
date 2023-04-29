import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  images: [
    {
      type: String,
    },
  ],
  category: {
    type: mongoose.Types.ObjectId,
    ref: "Category",
  },
  properties: { type: Object },
});
const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
