import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    clerkId: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    imageUrl: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "admin" },
  },
  { timestamps: true }
);

const User = model("User", userSchema);

export default User;
