import { NextApiRequest, NextApiResponse } from "next";
import User from "../../../../Models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import connectMongoDB from "../../../../lib/mongoose";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectMongoDB();
  if (req.method === "GET") {
    const user = await User.find({}).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: user,
    });
  }
}
