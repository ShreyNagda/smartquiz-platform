import { Schema, models, model } from "mongoose";

export interface IQuiz {
  _id: Schema.Types.ObjectId;
  title: string;
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
    text: string;
    options: string[];
    correct: string;
  }[];
  userDetailsRequired: boolean;
  randomizeQuestions: boolean;
  timeLimit: number;
  startsAt?: Date;
  endsAt?: Date;
  status: "not started" | "live" | "ended";
}

const quizSchema = new Schema<IQuiz>(
  {
    title: { type: String, required: true },
    desc: String,
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
        options: [String],
        correct: String,
      },
    ],
    timeLimit: Number,
    userDetailsRequired: { type: Boolean, default: true },
    randomizeQuestions: { type: Boolean, default: false },
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
