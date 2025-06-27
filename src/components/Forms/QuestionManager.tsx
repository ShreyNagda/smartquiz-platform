"use client";
import React, { useEffect, useState } from "react";
//Shadcn Components
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { toast } from "sonner";
//Custom Components
import QuestionDialog from "../Dialogs/QuestionDialog";
import GenerateFromFileDialog from "../Dialogs/GenerateFromFileDialog";
import GenerateUsingAiDialog from "../Dialogs/GenerateUsingAiDialog";
//Icons
import { MdEdit } from "react-icons/md";
import { LuLoaderCircle } from "react-icons/lu";
import { ChevronDown } from "lucide-react";
import { FaInfoCircle, FaPlus } from "react-icons/fa";

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
  isLive?: boolean;
  setData: (value: Question[]) => void;
};

export default function QuestionManager({
  initialQuestions,
  setData,
  isLive = false,
}: Props) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [loading, setLoading] = useState(false);

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
    if (isLive) {
      toast.error("Quiz is live. Cannot edit");
      return;
    }
    setLoading(true);
    setData(questions); // Send updated questions to parent
    await new Promise((res) => setTimeout(res, 500));
    setLoading(false);
  };

  useEffect(() => {
    const beforeUnload = (e: BeforeUnloadEvent) => {
      const isDirty =
        JSON.stringify(questions) !== JSON.stringify(initialQuestions);
      if (isDirty) {
        console.log("Changes");
        e.preventDefault();
        e.returnValue = ""; // Required for most browsers
        return "";
      }
    };

    window.addEventListener("beforeunload", beforeUnload);
    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
    };
  }, [initialQuestions, questions]);

  return (
    <div className="flex flex-col items-start ">
      <div className="w-full flex  md:flex-row justify-between items-center">
        <div className="text-lg my-2 font-semibold">Question Manager</div>
        {isLive ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="rounded-xs flex items-center gap-2 bg-gray-500 hover:bg-gray-500/90">
                Add Question
                <FaInfoCircle />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-red-400">
              Quiz is live. No questions can be added.
            </TooltipContent>
          </Tooltip>
        ) : (
          <Popover>
            <PopoverTrigger asChild>
              <Button className="rounded-xs flex items-center gap-2 bg-background hover:bg-background/90">
                Add Question
                <ChevronDown />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="p-2 w-60 shadow-lg space-y-2 rounded-xs"
              align="end"
            >
              <QuestionDialog handleAddQuestion={handleAddQuestion}>
                <Button
                  variant="ghost"
                  className="w-full justify-start rounded-sm"
                >
                  <FaPlus /> New Question
                </Button>
              </QuestionDialog>
              <GenerateFromFileDialog
                onImport={(imported) => {
                  imported.forEach((q) => handleAddQuestion(q));
                }}
              />
              <GenerateUsingAiDialog />
            </PopoverContent>
          </Popover>
        )}
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
          <div className="flex gap-2 items-center">
            <Button
              type="submit"
              disabled={isLive || loading || initialQuestions === questions}
              className="min-w-[150px]"
              onClick={handleSave}
            >
              {loading ? (
                <LuLoaderCircle className="animate-spin h-5 w-5" />
              ) : (
                `Save ${initialQuestions === questions ? "All" : ""} Questions`
              )}
            </Button>
            {isLive && (
              <Tooltip>
                <TooltipTrigger>
                  <FaInfoCircle className="fill-red-400" />
                </TooltipTrigger>
                <TooltipContent className="bg-red-400">
                  Quiz is live. No changes can be made
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        ) : (
          "No Questions"
        )}
      </div>
    </div>
  );
}
