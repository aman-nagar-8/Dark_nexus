import { connectDB } from "@/lib/connectDB.js";
import User from "@/models/user.model.js";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    const { name, email, password } = await req.json();
    // Validate fields
    if (!name || !email || !password) {
      return NextResponse.json({
        status: 400,
        error: "fields are empty from user input",
        message: "All fields are required",
        success: false,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({
        status: 409,
        error: "With is email user already exist",
        message: "Email already registered",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });

    await user.save();

    return NextResponse.json({
      status: 200,
      error: null,
      message: "Email verified. Please log in.",
      success: true,
    });
  } catch (error) {
    console.log("error in register page : ", error);
  }
}
