import Quiz from "@/models/Quiz";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log(req.url);
  const body = await req.json();
  const { id } = body;
  if (!id) {
    return NextResponse.json({ status: 500, message: "No id provided" });
  }
  const res = await Quiz.findOne({ _id: id });
  return NextResponse.json(JSON.parse(JSON.stringify(res)));
}
