// import QuizCard from "@/components/QuizCard";

import QuizCard from "@/components/QuizCard";
import { auth } from "@/lib/auth";
import Quiz from "@/models/Quiz";
import React from "react";

export default async function DashboardPage() {
  const session = await auth();

  const quizzes = await Quiz.find({ hostId: session?.user?.id });
  return (
    <div className="h-svh w-full">
      <div className="text-xl underline underline-offset-8">My Quizzes</div>

      {quizzes && (
        <div className="max-w-[400px] md:max-w-3/4 grid grid-cols-1 md:grid-cols-2 gap-1 py-5">
          {quizzes.map((q, index) => (
            <QuizCard key={index} q={{ ...q }} />
          ))}
        </div>
      )}
    </div>
  );
}
