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

  return (
    <>
      <div className="text-left max-w-xl  p-4 text-lg">Preview</div>
      <iframe
        className="h-[500px] w-full border p-2 pointer-events-none"
        src={`${process.env.NEXT_PUBLIC_BASE_URL}/quiz/${id}`}
      ></iframe>
    </>
  );
}
