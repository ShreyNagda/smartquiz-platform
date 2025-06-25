import Quiz, { IQuiz } from "@/models/Quiz"; // Mongoose model
import { NextRequest, NextResponse } from "next/server";
import { stringSimilarity } from "string-similarity-js"; // not string-similarity-js

export async function POST(req: NextRequest) {
  try {
    const { quizId, name, details, answers } = await req.json();

    if (!quizId || !name || !answers) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const quiz: IQuiz | null = await Quiz.findById(quizId);
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    let totalScore = 0;
    let maxScore = 0;

    for (const question of quiz.questions) {
      const userAnswer = answers.find(
        (ans: { qid: string }) => ans.qid === question.qid
      );
      if (!userAnswer) continue;

      const marks = question.marks || 1;
      maxScore += marks;

      switch (question.type) {
        case "single":
          if (
            typeof userAnswer.answer === "string" &&
            userAnswer.answer === question.correct
          ) {
            totalScore += marks;
          }
          console.log(totalScore);
          break;

        case "multiple":
          if (
            Array.isArray(userAnswer.answer) &&
            Array.isArray(question.correct)
          ) {
            const correctSet = new Set(question.correct);
            const answerSet = new Set(userAnswer.answer);

            if (
              correctSet.size === answerSet.size &&
              [...correctSet].every((opt) => answerSet.has(opt))
            ) {
              totalScore += marks;
            }
          }
          console.log(totalScore);
          break;

        case "short":
          if (
            typeof userAnswer.answer === "string" &&
            typeof question.correct === "string"
          ) {
            const sim = stringSimilarity(userAnswer.answer, question.correct);

            if (sim > 0.9) totalScore += marks;
            else if (sim > 0.7) totalScore += marks * 0.7;
            else if (sim > 0.5) totalScore += marks * 0.5;
          }
          console.log(totalScore);
          break;

        default:
          break;
      }
    }

    const responseId = name.toLowerCase() + "-" + details.id;

    const newResponse = {
      id: responseId,
      name: name,
      details: details,
      answers,
      score: totalScore,
      maxScore: maxScore,
    };

    await Quiz.findByIdAndUpdate(quizId, {
      responses: [...quiz.responses, newResponse],
    });

    return NextResponse.json({
      message: "Quiz evaluated successfully",
      name,
      details,
      score: totalScore,
      maxScore,
      percentage: (totalScore / maxScore) * 100,
    });
  } catch (err) {
    console.error("Quiz scoring error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
