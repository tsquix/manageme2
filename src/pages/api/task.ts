import connectMongoDB from "../../../lib/mongoose.js";
import type { NextApiRequest, NextApiResponse } from "next";
import Task from "../../../Models/Task";
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

      const task = req.body;

      if (!task) {
        return res.status(400).json({ message: "Brak wymaganych danych" });
      }

      const newTask = await Task.create(task);

      res.status(201).json({
        message: "Pomyślnie utworzono task",
        data: newTask,
      });
    } catch (error) {
      console.error("Błąd serwera:", error);
      res.status(500).json({
        message: "Błąd serwera",
      });
    }
  }
  if (req.method === "GET") {
    try {
      await connectMongoDB();
      const tasks = await Task.find({});
      return res.status(200).json({ success: true, data: tasks });
    } catch (error) {
      console.error("Błąd serwera:", error);
      res.status(500).json({
        message: "Błąd serwera podczas ladowania projektow",
      });
    }
  }
  if (req.method === "PUT") {
    try {
      const { id, updatedData } = req.body;
      await connectMongoDB();
      await Task.findByIdAndUpdate(id, updatedData);
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
      await Task.findByIdAndDelete(id);
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Błąd serwera:", error);
      res.status(500).json({
        message: "Błąd serwera ",
      });
    }
  }
}
