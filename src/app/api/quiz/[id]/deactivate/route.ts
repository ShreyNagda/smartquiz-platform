import Quiz, { IQuiz } from "@/models/Quiz";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  const { id } = await params;

  // Find the quiz by ID
  const quiz: IQuiz | null = await Quiz.findById(id);
  if (!quiz) {
    return NextResponse.json({ message: "Quiz not found", status: 404 });
  }

  if (quiz.status === "ended") {
    return NextResponse.json({ message: "Quiz is already ended", status: 200 });
  }

  // Update the quiz status to live
  const res = await Quiz.findByIdAndUpdate(
    id,
    { status: "ended" },
    { new: true }
  );
  console.log("Updated Quiz:", res);

  return NextResponse.json({ message: "Quiz is now ended", status: 200 });
}
