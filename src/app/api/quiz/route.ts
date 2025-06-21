import Quiz from "@/models/Quiz";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { id } = body;
  const res = await Quiz.findOne({ _id: id });
  return NextResponse.json(JSON.parse(JSON.stringify(res)));
}
