import { Schema, models, model } from "mongoose";

export interface IQuiz {
  _id: Schema.Types.ObjectId;
  title: string;
  access?: string;
  code?: string;
  accessMode: "public" | "private";
  desc?: string;
  subject?: string;
  hostId: Schema.Types.ObjectId;
  responses: {
    id: string;
    name: string;
    details?: { class: string; id: string };
    answers: { qid: string; answer: string | string[] };
    score: number;
    maxScore: number;
  }[];
  questions: {
    qid: string;
    type: "single" | "multiple" | "short";
    text: string;
    options?: string[];
    correct?: string[] | string;
    marks?: number;
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
    code: {
      type: String,
      unique: true,
      minlength: 6,
      maxlength: 6,
      required: function () {
        return this.accessMode === "private";
      },
    },
    subject: String,
    hostId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    responses: [
      {
        _id: { type: String, unique: true },
        name: String,
        details: { class: String, id: String },
        answers: [{ qid: String, answer: Schema.Types.Mixed }],
        score: Number,
        maxScore: Number,
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
        correct: {
          type: Schema.Types.Mixed,
          required: true,
        },
        marks: Number,
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
