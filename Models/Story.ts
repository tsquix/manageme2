import mongoose from "mongoose";

const StorySchema = new mongoose.Schema({
  nazwa: { type: String, required: true, unique: true },
  opis: { type: String },
  priorytet: {
    type: String,
    enum: ["niski", "średni", "wysoki"],
  },
  projekt: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  dataUtworzenia: { type: Date, default: Date.now },
  stan: {
    type: String,
    enum: ["todo", "doing", "done"],
    default: "todo",
  },
  wlasciciel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
});

export default mongoose.models.Story || mongoose.model("Story", StorySchema);
