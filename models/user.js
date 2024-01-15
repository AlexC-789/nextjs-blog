import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    hasHobby: {
      type: Boolean,
      required: true,
    },
    chosenHobbies: {
      type: [String],
      required: true
    }
  },
  { timestamps: true }
);

const User = models.User || mongoose.model("User", userSchema, "userData");
export default User;