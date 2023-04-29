import { mongooseConnect } from "@/lib/mongoose";
import Product from "@/models/product";

export default async function handler(req, res) {
  const { method } = req;
  await mongooseConnect();
  console.log("connected");
  if (method === "GET") {
    if (req.query?.id) {
      const data = await Product.findOne({ _id: req.query.id });
      return res.status(200).json(data);
    }
    const data = await Product.find();
    return res.status(200).json(data);
  }
  if (method === "PUT") {
    const { title, desc, price, _id, images, category, properties } = req.body;
    const data = await Product.updateOne(
      { _id },
      { title, desc, price, images, category, properties }
    );
    res.json(data);
  }
  if (method === "DELETE") {
    if (req.query?.id) {
      await Product.deleteOne({ _id: req.query?.id });
      res.status(200).json("Successfully deleted");
    }
  }
  if (method === "POST") {
    const { title, desc, price, images, category, properties } = req.body;
    const newProduct = await Product.create({
      title,
      desc,
      price,
      images,
      category,
      properties,
    });
    await newProduct.save();
    res.json(newProduct);
  }
}
