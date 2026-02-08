const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },      // например: "Almaty"
    country: { type: String, trim: true },                   // опционально
    notes: { type: String, trim: true, maxlength: 200 }      // опционально
  },
  { timestamps: true }
);

module.exports = mongoose.model("Location", locationSchema);
