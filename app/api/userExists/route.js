import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectMongoDB();
    const {name, surname, email} = await req.json();
    const user = await User.findOne({name: name, surname: surname, email: email}).select("_id");
    return NextResponse.json({ user });
  } catch (error) {
    console.log(error);
  }
}
