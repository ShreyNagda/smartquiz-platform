import Quiz, { IQuiz } from "@/models/Quiz";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  console.log("Quiz ID:", id);

  // Find the quiz by ID
  const quiz: IQuiz | null = await Quiz.findById(id);
  if (!quiz) {
    return NextResponse.json({ message: "Quiz not found", status: 404 });
  }

  if (quiz.status === "live") {
    return NextResponse.json({ message: "Quiz is already live", status: 200 });
  }

  // Update the quiz status to live
  const res = await Quiz.findByIdAndUpdate(
    id,
    { status: "live" },
    { new: true }
  );
  console.log("Updated Quiz:", res);

  return NextResponse.json({ message: "Quiz is now live", status: 200 });
}
