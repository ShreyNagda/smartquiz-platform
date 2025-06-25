"use client";

import { Textarea } from "./ui/textarea";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

type Question = {
  qid: string;
  type: "single" | "multiple" | "short";
  text: string;
  options?: string[];
  correct?: string[] | string;
  marks?: number;
};

type Answer = {
  qid: string;
  index: number;
  answer: string | string[];
};

type Props = {
  question: Question;
  index: number;
  answer: Answer[];
  setAnswer: React.Dispatch<React.SetStateAction<Answer[]>>;
};

export default function QuestionCard({
  question,
  index,
  answer,
  setAnswer,
}: Props) {
  const currentAnswer = answer.find((a) => a.qid === question.qid);
  const selected =
    typeof currentAnswer?.answer === "string" ? currentAnswer?.answer : "";
  const selectedMultiple = Array.isArray(currentAnswer?.answer)
    ? currentAnswer.answer
    : [];

  const updateAnswer = (value: string | string[]) => {
    const existing = answer.find((a) => a.qid === question.qid);
    if (existing) {
      setAnswer((prev) =>
        prev.map((a) => (a.qid === question.qid ? { ...a, answer: value } : a))
      );
    } else {
      setAnswer((prev) => [
        ...prev,
        { qid: question.qid, index, answer: value },
      ]);
    }
  };

  const clearAnswer = () => {
    setAnswer((prev) => prev.filter((a) => a.qid !== question.qid));
  };

  return (
    <div className="flex-grow w-full max-w-[700px] mx-auto p-2 text-left md:text-center flex flex-col items-center justify-center gap-1">
      <div className="text-sm w-fit flex p-2 gap-6">
        Question No.{index + 1} [{question.marks || " "} Marks]
      </div>

      <div className="text-lg font-semibold">{question.text}</div>

      {question.type === "short" && (
        <>
          <p className="text-sm mt-2">Answer in brief</p>
          <Textarea
            placeholder="Enter your answer"
            value={selected}
            onChange={(e) => updateAnswer(e.target.value)}
            rows={8}
            className="bg-transparent text-white placeholder:text-white/20"
          />
        </>
      )}

      {question.type === "single" && (
        <>
          <p className="text-sm mt-2">Select 1 option</p>
          <RadioGroup
            className="w-full grid grid-cols-1 md:grid-cols-2 gap-2"
            value={selected}
            onValueChange={(value) => updateAnswer(value)}
          >
            {question.options?.map((opt, idx) => {
              const isSelected = selected === opt;
              return (
                <Label
                  key={idx}
                  className={`h-[40px] flex items-center space-x-2 border p-[12px] rounded-md bg-muted hover:bg-muted/50 cursor-pointer ${
                    isSelected && "border-primary"
                  }`}
                >
                  <RadioGroupItem value={opt} id={`${index}-${idx}`} />
                  <span>{opt}</span>
                </Label>
              );
            })}
          </RadioGroup>
        </>
      )}

      {question.type === "multiple" && (
        <>
          <p className="text-sm mt-4">
            Select {question.correct?.length} options
          </p>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2">
            {question.options?.map((opt, idx) => {
              const isChecked = selectedMultiple.includes(opt);
              return (
                <Label
                  key={idx}
                  className={`h-[40px] flex items-center gap-3 p-3 rounded-md border bg-muted hover:bg-muted/50 cursor-pointer ${
                    isChecked && "border-primary"
                  }`}
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={(checked: boolean) => {
                      const newSelected = checked
                        ? [...selectedMultiple, opt]
                        : selectedMultiple.filter((o) => o !== opt);
                      updateAnswer(newSelected);
                    }}
                  />
                  <span className="text-sm">{opt}</span>
                </Label>
              );
            })}
          </div>
        </>
      )}
      <Button
        variant={"link"}
        onClick={clearAnswer}
        disabled={currentAnswer === undefined}
      >
        Clear Answer
      </Button>
    </div>
  );
}
