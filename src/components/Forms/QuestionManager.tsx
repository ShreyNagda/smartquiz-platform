"use client";
import React, { useState } from "react";
import QuestionDialog from "./QuestionDialog";
import { Button } from "../ui/button";
import { MdEdit } from "react-icons/md";
import { LuLoader } from "react-icons/lu";

import { RiAiGenerate2 } from "react-icons/ri";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { FaPlus } from "react-icons/fa";

type Question = {
  qid: string;
  type: "single" | "multiple" | "short";
  text: string;
  options?: string[];
  correct?: string[] | string;
  marks?: number;
};

type Props = {
  initialQuestions: Question[];
  setData: (value: Question[]) => void;
};

export default function QuestionManager({ initialQuestions, setData }: Props) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [loading, setLoading] = useState(false);
  // useEffect(() => {
  //   if (initialQuestions !== questions) {
  //     alert("Unsaved changes");
  //   }
  // }, [initialQuestions, questions]);

  const handleAddQuestion = (data: {
    qid: string;
    type: "single" | "multiple" | "short";
    text: string;
    options?: string[];
    correct?: string[] | string;
    marks?: number;
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
    <div className="flex flex-col items-start p-2">
      <div className="w-full flex justify-between items-center">
        <div className="text-lg my-2 font-semibold">Question Manager</div>
        <div className="flex md:flex-row  gap-2 items-center p-2">
          <QuestionDialog handleAddQuestion={handleAddQuestion}>
            <Button variant={"secondary"}>
              <FaPlus />
              <div className="hidden md:block text-sm">Add Question</div>
            </Button>
          </QuestionDialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button type="button" variant={"outline"} className="text-sm">
                <div className="hidden md:inline-block">AI generate</div>
                <RiAiGenerate2 />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Coming Soon</DialogTitle>
              <DialogDescription>
                This feature is under development
              </DialogDescription>
            </DialogContent>
          </Dialog>
        </div>
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
            disabled={loading || initialQuestions === questions}
            className="min-w-[150px]"
            onClick={handleSave}
          >
            {loading ? (
              <LuLoader className="animate-spin h-5 w-5" />
            ) : (
              `Save ${initialQuestions === questions ? "All" : ""} Questions`
            )}
          </Button>
        ) : (
          "No Questions"
        )}
      </div>
    </div>
  );
}
