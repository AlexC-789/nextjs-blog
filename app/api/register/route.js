import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    let { name, surname, email, password, hasHobby } = await req.json();
    
    const validateEmail = (email) => {
      let emailCheck = String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
      
        return emailCheck ? emailCheck[0] : "";
    };

    email = validateEmail(email);

    if (!email) {
      return NextResponse.json(
        { message: "Email address cannot be validated." },
        { status: 500 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password length is too small."},
        { status: 500 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    await connectMongoDB();
    await User.create({name: name, surname: surname, email: email, password: hashedPassword, hasHobby: hasHobby, chosenHobbies: []});
    return NextResponse.json({ message: "User registered." }, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while registering the user." },
      { status: 500 }
    );
  }
}
