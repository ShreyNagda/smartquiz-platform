import dbConnect from "@/lib/db";
import Quiz from "@/models/Quiz";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();
  const body = await req.json();
  const { id, code } = body;
  const query: { _id?: string; code?: string } = {};
  if (id) query._id = id;
  else if (code) query.code = code;
  else {
    return NextResponse.json({
      status: 500,
      message: "No id or code provided",
    });
  }
  const res = await Quiz.findOne(query);
  return NextResponse.json(JSON.parse(JSON.stringify(res)));
}
