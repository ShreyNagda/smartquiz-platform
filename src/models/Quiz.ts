import { Schema, models, model } from "mongoose";

export interface IQuiz {
  _id: Schema.Types.ObjectId;
  title: string;
  access?: string;
  accessMode: "public" | "private";
  desc?: string;
  subject?: string;
  hostId: Schema.Types.ObjectId;
  responses: {
    id: string;
    name: string;
    details?: { class: string; roll: string };
    answers: { qid: string; answer: string };
    score: number;
  }[];
  questions: {
    qid: string;
    type: "single" | "multiple" | "short";
    text: string;
    options?: string[];
    correct?: string[] | string;
  }[];
  userDetailsRequired: boolean;
  randomizeQuestions: boolean;
  timeMode: "manual" | "automatic";
  timeLimit: number;
  startsAt?: Date;
  endsAt?: Date;
  status: "not started" | "live" | "ended";
}

const quizSchema = new Schema<IQuiz>(
  {
    title: { type: String, required: true },
    desc: String,
    accessMode: {
      type: String,
      enum: ["public", "private"],
      required: true,
      default: "private",
    },
    access: {
      type: String,
    },
    subject: String,
    hostId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    responses: [
      {
        id: String,
        name: String,
        details: { class: String, roll: String },
        answers: { qid: String, answer: String },
        score: Number,
      },
    ],
    questions: [
      {
        qid: String,
        text: String,
        type: {
          type: String,
          enum: ["single", "multiple", "short"],
          default: "single",
        },
        options: [String],
        correct: [String],
      },
    ],
    timeLimit: Number,
    userDetailsRequired: { type: Boolean, default: true },
    randomizeQuestions: { type: Boolean, default: false },
    timeMode: {
      type: String,
      enum: ["manual", "automatic"],
      default: "manual",
    },
    startsAt: Date,
    endsAt: Date,
    status: {
      type: String,
      enum: ["not started", "live", "ended"],
      default: "not started",
    },
  },
  { timestamps: true }
);

const Quiz = models.Quiz || model("Quiz", quizSchema);
export default Quiz;
