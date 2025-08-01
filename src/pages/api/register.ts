import bcrypt from "bcryptjs";
import User from "../../../models/User";
import connectMongoDB from "../../../lib/mongoose.js";
import type { NextApiRequest, NextApiResponse } from "next";
interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Metoda nie dozwolona" });
  }

  try {
    await connectMongoDB();

    const { name, email, password } = req.body as RegisterRequestBody;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Brak wymaganych danych" });
    }

    const existingUser = await User.findOne({ email }).maxTimeMS(10000);
    if (existingUser) {
      return res.status(400).json({ message: "Użytkownik już istnieje" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Rejestracja zakończona sukcesem",
      userId: user._id,
    });
  } catch (error) {
    console.error("Błąd serwera:", error);
    res.status(500).json({
      message: "Błąd serwera podczas rejestracji",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      code: error.code,
    });
  }
}
