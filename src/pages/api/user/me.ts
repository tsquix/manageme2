import { NextApiRequest, NextApiResponse } from "next";
import User from "../../../../Models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import connectMongoDB from "../../../../lib/mongoose";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const username = session.user.name;
  await connectMongoDB();
  if (req.method === "GET") {
    const user = await User.findOne({ name: username }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      user,
    });
  }
}
