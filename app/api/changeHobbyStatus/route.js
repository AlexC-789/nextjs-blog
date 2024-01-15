import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";

export async function POST(req) {
    try {
        await connectMongoDB();
        const {name, surname, email, chosenHobbies} = await req.json();
        const user = await User.findOne({name: name, surname: surname, email: email});
        user.hasHobby = true;
        user.chosenHobbies = chosenHobbies;
        user.save();
        return NextResponse.json({ message: "Document modifications saved." }, { status: 201 });

    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { message: "An error occurred while saving the document modifications." },
            { status: 500 }
          );
    }
}