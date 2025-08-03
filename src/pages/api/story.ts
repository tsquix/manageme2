import connectMongoDB from "../../../lib/mongoose.js";
import type { NextApiRequest, NextApiResponse } from "next";
import Project from "../../../Models/Project";
import Story from "../../../Models/Story";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth].js";

interface UpdateProjectRequestBody {
  id: string;
  updatedData: {
    name?: string;
    description?: string;
  };
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  const isGuest = session?.user?.role === "guest";
  const isReadonlyMethod = req.method === "GET";

  if (isGuest && !isReadonlyMethod) {
    return res.status(403).json({ message: "Brak uprawnień dla roli guest" });
  }

  if (req.method === "POST") {
    try {
      await connectMongoDB();

      const story = req.body;

      if (!story || !story.nazwa) {
        return res.status(400).json({ message: "Brak wymaganych danych" });
      }

      const existingStory = await Project.findOne({
        nazwa: story.nazwa,
      }).maxTimeMS(10000);
      if (existingStory) {
        return res.status(400).json({ message: "Story już istnieje" });
      }

      const newStory = await Story.create(story);

      res.status(201).json({
        message: "Pomyślnie utworzono projekt",
        data: newStory,
      });
    } catch (error) {
      console.error("Błąd serwera:", error);
      res.status(500).json({
        message: "Błąd serwera podczas tworzenia projektu",
      });
    }
  }
  if (req.method === "GET") {
    try {
      await connectMongoDB();
      const stories = await Story.find({});
      return res.status(200).json({ success: true, data: stories });
    } catch (error) {
      console.error("Błąd serwera:", error);
      res.status(500).json({
        message: "Błąd serwera podczas ladowania projektow",
      });
    }
  }
  if (req.method === "PUT") {
    try {
      const { updatedData, id } = req.body as UpdateProjectRequestBody;
      await connectMongoDB();

      if (updatedData && id) {
        const updatedStory = await Story.findByIdAndUpdate(id, updatedData, {
          new: true,
          runValidators: true,
        });

        return res.status(200).json({ success: true, data: updatedStory });
      }
    } catch (error) {
      console.error("Błąd serwera:", error);
      res.status(500).json({
        message: "Błąd serwera ",
      });
    }
  }
  if (req.method === "DELETE") {
    try {
      const { id } = req.body;
      await connectMongoDB();
      await Story.findByIdAndDelete(id);
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Błąd serwera:", error);
      res.status(500).json({
        message: "Błąd serwera ",
      });
    }
  }
}
