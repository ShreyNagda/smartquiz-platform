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
import BasicQuizForm from "@/components/Forms/BasicQuizForm";
import TimeQuizForm from "@/components/Forms/TimeQuizForm";
import Overview from "@/components/Forms/Overview";
import QuestionManager from "@/components/Forms/QuestionManager";
import { redirect } from "next/navigation";
import QuizResponseTable from "@/components/Forms/QuizResponseTable";

// type IQuiz = {};

export default async function QuizConfigPage({
  params,
}: {
  params: Promise<{ id: string }>;
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
    code?: string;
  }) => {
    "use server";
    try {
      await updateQuizBasic({ ...data, code: data.code, _id: id });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const setTimeData = async (data: { timeMode: string; timeLimit: number }) => {
    "use server";
    await updateQuizTime({ ...data, _id: id });
  };

  const setQuestionData = async (
    data: {
      qid: string;
      type: "single" | "multiple" | "short";
      text: string;
      options?: string[];
      correct?: string[] | string;
      marks?: number;
    }[]
  ) => {
    "use server";
    await updateQuizQuestions({ _id: id, questions: data });
  };

  return (
    <div className="flex-grow h-[500px] w-screen p-1 md:p-3">
      <Tabs
        defaultValue="overview"
        className="flex-col md:flex-row h-full w-full"
      >
        <DashboardNavigation id={id} status={quizData.status} />

        {/* Tab Content */}
        <div className="flex-grow h-full w-full p-3">
          <TabsContent value="overview" className="p-3">
            <Overview
              numberOfQuestions={quizData.questions.length || 0}
              numberOfResponses={quizData.responses.length || 0}
              quiz={quizData}
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
                code: quizData.code!,
              }}
              _id={id}
              setData={setBasicData}
              isLive={quizData.status === "live"}
            />
          </TabsContent>
          <TabsContent value="questions" className="p-3">
            {/* Replace with your real question manager */}
            <div className="">
              <QuestionManager
                initialQuestions={quizData.questions}
                setData={setQuestionData}
                isLive={quizData.status === "live"}
              />
            </div>
          </TabsContent>
          <TabsContent value="time" className="p-3">
            <TimeQuizForm
              initialTimeData={{
                timeMode: quizData.timeMode,
                timeLimit: quizData.timeLimit || 20,
              }}
              setData={setTimeData}
              isLive={quizData.status === "live"}
            />
          </TabsContent>
          <TabsContent className="" value="responses">
            <QuizResponseTable responses={quizData.responses} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
