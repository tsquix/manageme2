import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  //   stories: [
  //     {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "Story",
  //     },
  //   ],
});

export default mongoose.models.Project ||
  mongoose.model("Project", ProjectSchema);
