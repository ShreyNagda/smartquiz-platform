import Quiz from "@/models/Quiz";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { ...data } = body;
  const newQuiz = await Quiz.create(data);
  console.log(newQuiz);
  return NextResponse.json({
    message: "Quiz created successsfully!",
    data: newQuiz,
  });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { _id, ...data } = body;
  const quiz = await Quiz.findOne({ _id });
  const questions = quiz.questions;
  const newQuestions = [...questions, ...data["questions"]!];
  const res = await Quiz.findByIdAndUpdate(
    _id,
    { $set: { ...data, questions: newQuestions } },
    { new: true }
  );
  return NextResponse.json({ message: "Quiz updated successfully", data: res });
}
