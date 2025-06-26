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

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useRouter } from "next/navigation";

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

      const attempted = JSON.parse(localStorage.getItem("quizzes") || "[]");
      localStorage.setItem("quizzes", JSON.stringify([...attempted, quizId]));
    },
    [answers, quizData._id, userData]
  );

  function generatePDF({
    score,
    maxScore,
    quizData,
    userData,
    answers,
  }: {
    score: number;
    maxScore: number;
    quizData: {
      title: string;
      questions: { qid: string; text: string }[];
    };
    userData: {
      name: string;
      details?: {
        id: string;
        class?: string;
      };
    };
    answers: {
      qid: string;
      index: number;
      answer: string | string[];
    }[];
  }) {
    const doc = new jsPDF();
    const questions = quizData.questions;

    // Header
    doc.setFontSize(16);
    doc.text(quizData.title, 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.text(`Name: ${userData.name}`, 14, 30);
    if (userData.details?.class)
      doc.text(`Class: ${userData.details.class}`, 14, 37);
    if (userData.details?.id) doc.text(`ID: ${userData.details.id}`, 14, 44);

    doc.text(`Score: ${score} / ${maxScore}`, 14, 55);

    // Table of Answers
    autoTable(doc, {
      startY: 65,
      head: [["Q#", "Question", "Answer"]],
      body: answers.map((a, i) => [
        i + 1,
        questions.find((q) => q.qid === a.qid)?.text || "N/A",
        Array.isArray(a.answer) ? a.answer.join(", ") : a.answer,
      ]),
    });

    doc.save(`${userData.name}_quiz_result.pdf`);
  }

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
      <div className="h-screen flex items-center justify-center">
        <LuLoaderCircle className="animate-spin text-2xl" />
      </div>
    );
  }

  if (submitted?.isSubmitted && response) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-2 text-center p-4">
        <h2 className="text-xl font-semibold">Quiz Submitted!</h2>
        {submitted.reason && (
          <p className="text-sm mt-2 text-muted-foreground">
            Reason: {submitted.reason}
          </p>
        )}
        <div className="text-xl">{response.name}</div>
        <div>
          [{response.details?.class}] [{response.details?.id}]
        </div>
        <div>
          {response.score} / {response.maxScore}
        </div>
        <Button
          onClick={() =>
            generatePDF({
              score: response.score,
              maxScore: response.maxScore,
              quizData,
              userData,
              answers,
            })
          }
        >
          Download Response as PDF
        </Button>
        <Button variant={"secondary"} onClick={() => router.replace("/")}>
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <section className="h-svh w-full flex flex-col">
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
