"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import QuestionCard from "@/components/QuestionCard";
import QuestionNavigator from "@/components/QuestionNavigator";
import QuizTimer from "@/components/QuizTimer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { IQuiz } from "@/models/Quiz";
import { LuLoaderCircle } from "react-icons/lu";

import { useRouter } from "next/navigation";
import DownloadResponsePDFButton from "./Buttons/DownloadResponseButton";

type UserData = {
  name: string;
  details?: {
    id: string;
    class?: string;
  };
};

type Answer = {
  qid: string;
  index: number;
  answer: string | string[];
};

export default function QuizAttempt({
  quizData,
  userData,
}: {
  quizData: IQuiz;
  userData: UserData;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [submitted, setSubmitted] = useState<{
    isSubmitted: boolean;
    reason?: string;
  } | null>(null);

  const [response, setResponse] = useState<{
    name: string;
    details?: {
      id: string;
      class?: string;
    };
    answers: Answer[];
    score: number;
    maxScore: number;
  } | null>(null);

  const violationCount = useRef(0);
  const router = useRouter();

  const questions = quizData.questions;

  const handleSubmit = useCallback(
    async (reason?: string) => {
      setSubmitted({ isSubmitted: true, reason });

      const quizId = quizData._id;
      const userResponse = {
        quizId: quizId,
        name: userData.name,
        details: userData.details,
        answers,
      };
      const apiResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/response`,
        { method: "POST", body: JSON.stringify(userResponse) }
      );
      const data = await apiResponse.json();
      setResponse(data);

      // const attempted = JSON.parse(localStorage.getItem("quizzes") || "[]");
      // localStorage.setItem("quizzes", JSON.stringify([...attempted, quizId]));
    },
    [answers, quizData._id, userData]
  );

  useEffect(() => {
    if (submitted?.isSubmitted) return;

    const onUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        violationCount.current += 1;
        if (violationCount.current >= 3) {
          alert("3 tab switches detected. Auto-submitting quiz.");
          handleSubmit("Switched tabs 3 times");
        } else {
          alert(`Warning ${violationCount.current}/3: Do not switch tabs.`);
        }
      }
    };

    window.addEventListener("beforeunload", onUnload);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", onUnload);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [submitted, handleSubmit]);

  if (!questions?.length) {
    return (
      <div className="flex items-center justify-center">
        <LuLoaderCircle className="animate-spin text-2xl" />
      </div>
    );
  }

  if (submitted?.isSubmitted && response) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 text-center p-4">
        <h2 className="text-xl font-semibold">Quiz Submitted!</h2>
        {submitted.reason && (
          <p className="text-sm mt-2 text-muted-foreground">
            Reason: {submitted.reason}
          </p>
        )}
        <div className="text-xl">{response.name}</div>
        {response.details && (
          <div>
            [{response.details?.class}] [{response.details?.id}]
          </div>
        )}
        <div>
          {response.score} / {response.maxScore}
        </div>
        <DownloadResponsePDFButton
          quiz={quizData}
          score={response.score}
          maxScore={response.maxScore}
          user={userData}
          answers={answers}
        />
        <Button variant={"secondary"} onClick={() => router.replace("/")}>
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <section className="w-full flex flex-col">
      <h2 className="text-xl text-center font-semibold py-4">
        {quizData.title}
      </h2>
      <QuizTimer
        timeLimit={quizData.timeLimit || 10}
        onComplete={() => handleSubmit("Time's up")}
      />

      <QuestionCard
        question={questions[currentIndex]}
        index={currentIndex}
        answer={answers}
        setAnswer={setAnswers}
      />

      <div className="flex flex-col md:flex-row items-center justify-center gap-3 py-4">
        <QuestionNavigator
          total={questions.length}
          current={currentIndex}
          onNavigate={setCurrentIndex}
        />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">Submit</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Submit Quiz</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit? Unanswered questions will be
              marked 0.
            </AlertDialogDescription>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleSubmit()}>
              Submit
            </AlertDialogAction>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </section>
  );
}
