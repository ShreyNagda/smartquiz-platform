// import QuizCard from "@/components/QuizCard";

import DashboardQuizCard from "@/components/DashboardQuizCard";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { getQuizzesByHost } from "@/lib/helpers/quiz";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

interface IQuiz {
  _id: string;
  title: string;
  desc?: string;
  questions: object[];
  responses: object[];
  status: string;
}

export default async function DashboardPage() {
  await dbConnect();
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/error/NotSignedIn`);
  }

  const quizzes = await getQuizzesByHost(session.user.id);

  const serializableQuizzes = JSON.parse(JSON.stringify(quizzes));

  return (
    <div className="items-start w-full p-4 md:p-8">
      <div className="text-xl underline underline-offset-8">My Quizzes</div>

      {quizzes && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 py-5">
          {serializableQuizzes.map((q: IQuiz) => {
            return <DashboardQuizCard key={q._id} q={q} />;
          })}
        </div>
      )}
      {/* <AddQuizButton /> */}
      <Button asChild>
        <Link href={`dashboard/quiz/new`}>Create Quiz</Link>
      </Button>
    </div>
  );
}
