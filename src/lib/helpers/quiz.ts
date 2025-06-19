"use server";
import Quiz from "@/models/Quiz";
import dbConnect from "../db";

// import { QuizFormProps } from "@/components/BasicQuizForm";

type CreateQuizData = {
  title: string;
  desc?: string;
  randomizeQuestions?: boolean;
  userDetailsRequired?: boolean;
  hostId: string;
};

type BasicQuizData = {
  _id: string;
  title: string;
  desc?: string;
  randomizeQuestions?: boolean;
  userDetailsRequired?: boolean;
  accessMode: string;
  access: string;
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
  }[];
};

export async function createQuiz(data: CreateQuizData) {
  await dbConnect();
  const res = await Quiz.create(data);
  return res;
}

export async function getQuizzesByHost(hostId: string) {
  await dbConnect();
  const quizzes = await Quiz.find({ hostId: hostId });
  return quizzes;
}

export async function updateQuizBasic(quizData: BasicQuizData) {
  //   console.log(quizData);
  await dbConnect();
  const { _id, ...data } = quizData;
  await Quiz.findByIdAndUpdate(_id, data, {
    new: true,
    runValidators: true,
  });
}

export async function addQuestions(_id: string, questions: []) {
  await dbConnect();
  console.log(_id, questions);
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
  await Quiz.findByIdAndUpdate(
    _id,
    { questions },
    {
      new: true,
      runValidators: true,
    }
  );
}
