import Quiz, { IQuiz } from "@/models/Quiz";
import { redirect } from "next/navigation";

export default async function QuizPage({
  params,
}: {
  params: { id: string };
  searchParams: { preview: boolean };
}) {
  const { id } = await params;

  const quizData: IQuiz | null = await Quiz.findOne({ _id: id });
  console.log(quizData);

  if (!quizData) {
    redirect("/error/quiz-not-found");
  }

  return <div className="w-full">Preview</div>;
}
