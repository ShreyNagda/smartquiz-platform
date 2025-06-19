"use client";
import React, { useState } from "react";
import QuestionDialog from "./QuestionDialog";
import { Button } from "./ui/button";
import { LuLoader } from "react-icons/lu";
import { MdEdit } from "react-icons/md";

type Question = {
  qid: string;
  type: "single" | "multiple" | "short";
  text: string;
  options?: string[];
  correct?: string[] | string;
};

type Props = {
  initialQuestions: Question[];
  setData: (value: Question[]) => void;
};

export default function QuestionManager({ initialQuestions, setData }: Props) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [loading, setLoading] = useState(false);

  const handleAddQuestion = (data: {
    qid: string;
    type: "single" | "multiple" | "short";
    text: string;
    options?: string[];
    correct?: string[] | string;
  }) => {
    setQuestions((prev) => {
      const exists = prev.find((q) => q.qid === data.qid);

      if (exists) {
        // Editing existing question
        return prev.map((q) => (q.qid === data.qid ? { ...data } : q));
      } else {
        // Adding new question
        return [...prev, { ...data }];
      }
    });
  };

  const handleSave = async () => {
    setLoading(true);
    setData(questions); // Send updated questions to parent
    await new Promise((res) => setTimeout(res, 500));
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-start ">
      <div className="w-full flex justify-between items-center">
        <div className="text-lg my-2 font-semibold">Question Manager</div>
        <QuestionDialog handleAddQuestion={handleAddQuestion} />
      </div>

      <div className="space-y-2 w-full">
        {questions.map((question, index) => (
          <div
            key={question.qid}
            className="flex items-center justify-between p-2 border rounded"
          >
            <div className="font-base">
              {index + 1}. {question.text}
            </div>
            <QuestionDialog
              initialQuestion={question}
              handleAddQuestion={handleAddQuestion}
            >
              <Button type="button" variant={"link"}>
                <MdEdit />
              </Button>
            </QuestionDialog>
          </div>
        ))}
        {questions.length > 0 ? (
          <Button
            type="submit"
            disabled={loading}
            className="min-w-[150px]"
            onClick={handleSave}
          >
            {loading ? (
              <LuLoader className="animate-spin h-5 w-5" />
            ) : (
              "Save All Questions"
            )}
          </Button>
        ) : (
          "No Questions"
        )}
      </div>
    </div>
  );
}
