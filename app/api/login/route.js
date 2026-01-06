import { connectDB } from "@/lib/connectDB.js";
import User from "@/models/user.model.js";
import bcrypt from "bcrypt";
import { genrateToken } from "@/lib/setToken.js"
import { NextResponse } from "next/server";
import { error } from "console";

export async function POST(req) {
  try {
    await connectDB();

    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({
        status: 400,
        error: null,
        message: "All fields are required",
        success: false,
      });
    }

    const user = await User.findOne({ email: email.trim() }).select(
      "+password"
    );

    if (!user) {
      return NextResponse.json({
        status: 404,
        error: null,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({
        status: 401,
        error: null,
        message: "Invalid email or password",
        success: false,
      });
    }
    const res = NextResponse.json({
        status:200,
        error:null,
        message:"Login Successfully",
        success:true,
    })
    return res;
    genrateToken(user._id , res);
  } catch (error) {
    console.log("error in login page : ",error);
  }
}
