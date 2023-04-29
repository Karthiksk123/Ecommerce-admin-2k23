const { Schema, models, model, default: mongoose } = require("mongoose");

const categorySchema = new Schema({
  name: {
    type: String,
  },
  parent: {
    type: mongoose.Types.ObjectId,
    ref: "Category",
  },
  properties: [{ type: Object }],
});

export const Category = models?.Category || model("Category", categorySchema);
