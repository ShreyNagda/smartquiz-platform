import Quiz from "@/models/Quiz";
import { NextResponse } from "next/server";

export async function GET() {
  const res = await Quiz.find();
  return NextResponse.json({ message: "Hello", data: res });
}
