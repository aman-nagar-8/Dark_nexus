import { connectDB } from "@/lib/connectDB.js";
import Meeting from "@/models/meeting.model.js";
import {getUser} from "@/lib/getUserFromreq.js";

export async function POST(req) {
  try {
    await connectDB();
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json(
        { error: "Name and URL are required" },
        { status: 400 }
      );
    }

    const userToken = await getUser(req);
    if (!userToken) {
      return NextResponse.json(
        { message: "Refresh token missing" },
        { status: 401 }
      );
    }

    const meeting = await Meeting.create({
      url,
      admin: userToken._id,
      adminName: adminUser.name,
      members: [adminUser._id], // Add admin as first member
    });
  } catch (error) {
    console.log("error in create meeting : ", error);
  }
}
