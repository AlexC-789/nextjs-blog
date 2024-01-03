import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { name, surname, email, password, hasHobby, chosenHobby} = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    await connectMongoDB();
    
    await User.create({name: name, surname: surname, email: email, password: hashedPassword, hasHobby: hasHobby, chosenHobby: chosenHobby});
    return NextResponse.json({ message: "User registered." }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while registering the user." },
      { status: 500 }
    );
  }
}
