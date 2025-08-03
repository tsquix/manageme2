import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  nazwa: { type: String, required: true },
  opis: { type: String },
  priorytet: {
    type: String,
    enum: ["niski", "średni", "wysoki"],
  },
  storyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Story",
    required: true,
  },
  przewidywanyCzas: { type: Number },
  stan: {
    type: String,
    enum: ["todo", "doing", "done"],
    default: "todo",
  },
  dataZakonczenia: { type: String },
  createdAt: { type: Date, default: Date.now },
  odpowiedzialnyUzytkownik: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
});

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);
