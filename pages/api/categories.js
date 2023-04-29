import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Categories";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
  if (method === "POST") {
    const { name, parentCategory, properties } = req.body;
    const newCategory = await Category.create({
      name,
      parent: parentCategory || undefined,
      properties,
    });
    res.json(newCategory);
  }
  if (method === "GET") {
    const allCategories = await Category.find().populate("parent");
    res.json(allCategories);
  }
  if (method === "PUT") {
    const { _id, name, parentCategory, properties } = req.body;
    const updatedCategories = await Category.updateOne(
      { _id },
      {
        name,
        parent: parentCategory || undefined,
        properties,
      }
    );
    res.json(updatedCategories);
  }
  if (method === "DELETE") {
    const { id } = req.query;
    await Category.deleteOne({ _id: id });
    res.json("Deleted Successfuly!!");
  }
}
