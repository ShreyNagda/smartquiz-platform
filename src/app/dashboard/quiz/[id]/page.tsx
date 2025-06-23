// app/quiz-config/[id]/page.tsx

import React from "react";
import dbConnect from "@/lib/db";
import Quiz, { IQuiz } from "@/models/Quiz";

import {
  updateQuizBasic,
  updateQuizQuestions,
  updateQuizTime,
} from "@/lib/helpers/quiz";
import { Tabs, TabsContent } from "@/components/ui/tabs";

import DashboardNavigation from "@/components/DashboardNavigation";
import BasicQuizForm from "@/components/BasicQuizForm";
import TimeQuizForm from "@/components/TimeQuizForm";
import Overview from "@/components/Overview";
import QuestionManager from "@/components/QuestionManager";
import { redirect } from "next/navigation";

// type IQuiz = {};

export default async function QuizConfigPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  dbConnect();

  // Safely serialize the quiz
  const quizDoc: IQuiz | null = await Quiz.findById(id);
  const quizData: IQuiz = JSON.parse(JSON.stringify(quizDoc));

  if (!quizData) {
    redirect("/error/no-quiz-found");
  }

  const setBasicData = async (data: {
    title: string;
    desc?: string;
    randomizeQuestions?: boolean;
    userDetailsRequired?: boolean;
    accessMode: string;
    access: string;
  }) => {
    "use server";
    await updateQuizBasic({ ...data, _id: id });
  };

  const setTimeData = async (data: { timeMode: string; timeLimit: number }) => {
    "use server";
    await updateQuizTime({ ...data, _id: id });
    // await updateQuizBasic({ ...data, _id: id });
  };

  const setQuestionData = async (
    data: {
      qid: string;
      type: "single" | "multiple" | "short";
      text: string;
      options?: string[];
      correct?: string[] | string;
    }[]
  ) => {
    "use server";
    console.log(data);
    updateQuizQuestions({ _id: id, questions: data });
  };

  return (
    <div className="flex-grow h-full w-screen p-3">
      <Tabs
        defaultValue="overview"
        className="flex-col md:flex-row h-full w-full"
      >
        <DashboardNavigation id={id} status={quizData.status} />

        {/* Tab Content */}
        <div className="flex-grow w-full">
          <TabsContent value="overview" className="p-3">
            <Overview
              numberOfQuestions={quizData.questions.length || 0}
              numberOfResponses={quizData.responses.length || 0}
              accessMode={quizData.accessMode}
              access={quizData.access || ""}
              id={id}
            />
          </TabsContent>
          <TabsContent value="basic" className="p-3">
            <BasicQuizForm
              initialQuizData={{
                title: quizData.title,
                desc: quizData.desc,
                randomizeQuestions: quizData.randomizeQuestions,
                userDetailsRequired: quizData.userDetailsRequired,
                accessMode: quizData.accessMode,
                access: quizData.access!,
              }}
              _id={id}
              setData={setBasicData}
            />
          </TabsContent>
          <TabsContent value="questions" className="p-3">
            {/* Replace with your real question manager */}
            <div className="">
              <QuestionManager
                initialQuestions={quizData.questions}
                setData={setQuestionData}
              />
            </div>
          </TabsContent>
          <TabsContent value="time" className="p-3">
            <TimeQuizForm
              initialTimeData={{
                timeMode: quizData.timeMode,
                timeLimit: quizData.timeLimit,
              }}
              setData={setTimeData}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
