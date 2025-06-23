"use server";
import Quiz from "@/models/Quiz";
import dbConnect from "../db";
import mongoose from "mongoose";

// import { QuizFormProps } from "@/components/BasicQuizForm";

type CreateQuizData = {
  title: string;
  desc?: string;
  randomizeQuestions?: boolean;
  userDetailsRequired?: boolean;
  hostId: string;
  code?: string;
};

type BasicQuizData = {
  _id: string;
  title: string;
  desc?: string;
  randomizeQuestions?: boolean;
  userDetailsRequired?: boolean;
  accessMode: string;
  access: string;
  code?: string;
};

type TimeQuizData = {
  _id: string;
  timeLimit: number;
  startsAt?: Date;
  endsAt?: Date;
  timeMode: string;
};

type QuestionsQuizData = {
  _id: string;
  questions: {
    qid: string;
    type: "single" | "multiple" | "short";
    text: string;
    options?: string[];
    correct?: string[] | string;
    marks?: number;
  }[];
};

export async function getQuizzesByHost(hostId: string) {
  await dbConnect();
  const quizzes = await Quiz.find({ hostId: hostId });
  return quizzes;
}

export async function createQuiz(data: CreateQuizData) {
  await dbConnect();
  const newId = new mongoose.Types.ObjectId();
  const res = await Quiz.create({
    _id: newId,
    ...data,
    access: `${process.env.NEXT_PUBLIC_BASE_URL}/quiz/${newId}`,
  });
  return res;
}

export async function updateQuizBasic(quizData: BasicQuizData) {
  //   console.log(quizData);
  await dbConnect();
  const { _id, ...data } = quizData;
  if (data.accessMode === "private" && data.code === undefined) {
    throw new Error("Code is required");
  }

  await Quiz.findByIdAndUpdate(
    _id,
    { ...data, code: data.code },
    {
      new: true,
      runValidators: true,
    }
  );
}

export async function updateQuizTime(quizData: TimeQuizData) {
  //   console.log(quizData);
  await dbConnect();
  const { _id, ...data } = quizData;
  await Quiz.findByIdAndUpdate(_id, data, {
    new: true,
    runValidators: true,
  });
}

export async function updateQuizQuestions(questionsData: QuestionsQuizData) {
  await dbConnect();
  const { _id, questions } = questionsData;

  // Transform correct based on question type
  const formattedQuestions = questions.map((q) => {
    let formattedCorrect: string | string[] | undefined = q.correct;

    if (q.type === "multiple") {
      // Ensure it's an array
      if (!Array.isArray(q.correct)) {
        formattedCorrect = typeof q.correct === "string" ? [q.correct] : [];
      }
    } else {
      // Ensure it's a string
      if (Array.isArray(q.correct)) {
        formattedCorrect = q.correct[0] || "";
      }
    }

    return {
      ...q,
      correct: formattedCorrect,
    };
  });
  await Quiz.findByIdAndUpdate(
    _id,
    { questions: formattedQuestions },
    {
      new: true,
      runValidators: true,
    }
  );
}
