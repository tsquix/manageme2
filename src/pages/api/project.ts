import connectMongoDB from "../../../lib/mongoose.js";
import type { NextApiRequest, NextApiResponse } from "next";
import Project from "../../../Models/Project";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth].js";
interface CreateProjectRequestBody {
  name: string;
  description: string;
}

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

      const { name, description } = req.body as CreateProjectRequestBody;

      if (!name) {
        return res.status(400).json({ message: "Brak wymaganych danych" });
      }

      const existingProject = await Project.findOne({ name }).maxTimeMS(10000);
      if (existingProject) {
        return res.status(400).json({ message: "Projekt już istnieje" });
      }

      const project = await Project.create({
        name,
        description,
      });

      res.status(201).json({
        message: "Pomyślnie utworzono projekt",
        data: project,
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
      const projects = await Project.find({});
      return res.status(200).json({ success: true, data: projects });
    } catch (error) {
      console.error("Błąd serwera:", error);
      res.status(500).json({
        message: "Błąd serwera podczas ladowania projektow",
      });
    }
  }
  if (req.method === "PUT") {
    try {
      const { id, updatedData } = req.body as UpdateProjectRequestBody;
      await connectMongoDB();
      await Project.findByIdAndUpdate(id, updatedData);
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Błąd serwera:", error);
      res.status(500).json({
        message: "Błąd serwera ",
      });
    }
  }
  if (req.method === "DELETE") {
    try {
      const { id } = req.body as UpdateProjectRequestBody;
      await connectMongoDB();
      await Project.findByIdAndDelete(id);
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Błąd serwera:", error);
      res.status(500).json({
        message: "Błąd serwera ",
      });
    }
  }
}
