// app/quiz-config/[id]/page.tsx

import React from "react";
import { redirect } from "next/navigation";
import Quiz, { IQuiz } from "@/models/Quiz";
import BasicQuizForm from "@/components/BasicQuizForm";

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IoMenu } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import QuestionManager from "@/components/QuestionManager";

export default async function QuizConfigPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Safely serialize the quiz
  const quizDoc: IQuiz | null = await Quiz.findById(id);
  const quizData = JSON.parse(JSON.stringify(quizDoc));

  const tabs = [
    { title: "Basic Settings", value: "basic" },
    { title: "Question Manager", value: "questions" },
    { title: "Time Settings", value: "time" },
  ];

  if (!quizData) {
    redirect("/error/no-quiz-found");
  }

  return (
    <div className="flex-grow h-full w-screen p-3">
      <Tabs defaultValue="basic" className="flex-col md:flex-row h-full w-full">
        {/* Desktop Tabs */}
        <TabsList className="hidden md:flex gap-4 mb-4">
          {tabs.map((tab) => (
            <TabsTrigger value={tab.value} key={tab.value}>
              {tab.title}
            </TabsTrigger>
          ))}
          <Button>Activate Quiz</Button>
        </TabsList>

        {/* Mobile Sheet Menu */}
        <div className="md:hidden mb-4">
          <Sheet modal={false}>
            <SheetTrigger className="p-2 border rounded-md shadow-sm">
              <IoMenu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent
              side="left"
              className="!absolute !left-0 w-64 overflow-y-auto shadow-2xl rounded-r-md border p-3"
            >
              <SheetTitle className="text-base font-semibold mb-3">
                Quiz Settings
              </SheetTitle>
              <TabsList className="flex flex-col items-start space-y-2">
                {tabs.map((tab) => (
                  <TabsTrigger value={tab.value} key={tab.value}>
                    {tab.title}
                  </TabsTrigger>
                ))}
              </TabsList>
              <SheetFooter>
                <Button>Activate Quiz</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>

        {/* Tab Content */}
        <div className="flex-grow w-full relative">
          <TabsContent value="basic" className="p-3">
            <BasicQuizForm
              initialQuizData={{
                ...quizData,
              }}
            />
          </TabsContent>
          <TabsContent value="questions" className="p-3">
            {/* Replace with your real question manager */}
            <div>
              <QuestionManager questions={quizData.questions} />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
