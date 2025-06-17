import { Schema, model, models } from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  quiz: Schema.Types.ObjectId[];
  password?: string;
  image?: string;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: [true, "Name is required"] },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true, "Email already in use"],
  },
  password: { type: String },
  image: { type: String },
  quiz: [{ type: Schema.Types.ObjectId, ref: "Quiz" }],
});

const User = models.User || model("User", userSchema);
export default User;
