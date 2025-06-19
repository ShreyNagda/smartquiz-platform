"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { FaInfo } from "react-icons/fa";

type Question = {
  qid: string;
  type: "single" | "multiple" | "short";
  text: string;
  options?: string[];
  correct?: string[] | string;
};

type Props = {
  initialQuestion?: Question;
  handleAddQuestion: (data: Question) => void;
  children?: React.ReactNode;
};

export default function QuestionDialog({
  initialQuestion,
  handleAddQuestion,
  children,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [qData, setQData] = useState<Question>(() => {
    return initialQuestion && initialQuestion.qid
      ? initialQuestion
      : {
          qid: Math.random().toString(36).substring(2, 6),
          text: "",
          type: "single",
          options: ["", ""],
          correct: "",
        };
  });

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Trimmed text validation
    if (!qData.text.trim()) {
      setError("Question text cannot be empty.");
      return;
    }

    const hasDuplicates = (arr: string[]) => new Set(arr).size !== arr.length;
    if (hasDuplicates(qData.options!)) {
      setError("Duplicate options");
      return;
    }
    // if(qData.options.)

    if (qData.type === "short") {
      if (
        !qData.correct ||
        (typeof qData.correct === "string" && !qData.correct.trim())
      ) {
        setError("Please provide a sample correct answer for short question.");
        return;
      }
    } else {
      const filledOptions = (qData.options || []).filter(
        (opt) => opt.trim() !== ""
      );
      if (filledOptions.length < 2) {
        setError("Please provide at least 2 non-empty options.");
        return;
      }

      if (
        qData.type === "single" &&
        (!qData.correct || !filledOptions.includes(qData.correct as string))
      ) {
        setError("Please select one correct option.");
        return;
      }

      if (
        qData.type === "multiple" &&
        (!Array.isArray(qData.correct) ||
          (qData.correct as string[]).length === 0)
      ) {
        setError("Please select at least one correct option.");
        return;
      }
    }

    // If all validations pass
    handleAddQuestion(qData);
    setIsOpen(false);
  };

  const updateOption = (index: number, value: string) => {
    const updated = [...(qData.options || [])];
    updated[index] = value;
    setQData((prev) => ({ ...prev, options: updated }));
  };

  const toggleCorrect = (value: string) => {
    if (qData.type === "single") {
      setQData((prev) => ({ ...prev, correct: value }));
    } else {
      const correct = Array.isArray(qData.correct) ? [...qData.correct] : [];
      if (correct.includes(value)) {
        setQData((prev) => ({
          ...prev,
          correct: correct.filter((opt) => opt !== value),
        }));
      } else {
        setQData((prev) => ({ ...prev, correct: [...correct, value] }));
      }
    }
  };

  const handleAddOption = () => {
    if ((qData.options?.length || 0) < 4) {
      setQData((prev) => ({
        ...prev,
        options: [...(prev.options || []), ""],
      }));
    }
  };

  const handleRemoveOption = (index: number) => {
    const updated = [...(qData.options || [])];
    const removed = updated.splice(index, 1);
    let newCorrect = qData.correct;

    if (Array.isArray(newCorrect)) {
      newCorrect = newCorrect.filter((c) => c !== removed[0]);
    } else if (newCorrect === removed[0]) {
      newCorrect = "";
    }

    setQData((prev) => ({
      ...prev,
      options: updated,
      correct: newCorrect,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button variant={"secondary"}>Add Question</Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Add Question</DialogTitle>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="flex gap-2 items-center text-red-400">
              <FaInfo />
              {error}
            </div>
          )}
          <Textarea
            placeholder="Question Text"
            value={qData.text}
            onChange={(ev) =>
              setQData((prev) => ({ ...prev, text: ev.target.value }))
            }
          />

          <div className="flex items-center gap-2">
            <Label>Question Type:</Label>
            <Select
              defaultValue={qData.type}
              onValueChange={(value) => {
                setQData((prev) => ({
                  ...prev,
                  type: value as "single" | "multiple" | "short",
                  options: value === "short" ? [" ", " "] : prev.options,
                  correct: value === "multiple" ? [] : "",
                }));
              }}
            >
              <SelectTrigger className="w-[200px] border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-50">
                <SelectItem value="single">Single Choice</SelectItem>
                <SelectItem value="multiple">Multiple Choice</SelectItem>
                <SelectItem value="short">Short</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {qData.type === "short" ? (
            <Textarea
              placeholder="Sample short answer"
              onChange={(ev) =>
                setQData((prev) => ({ ...prev, correct: ev.target.value }))
              }
            />
          ) : (
            <div className="space-y-2">
              {qData.options?.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  {qData.type === "single" ? (
                    <RadioGroup
                      value={qData.correct as string}
                      onValueChange={(val) => toggleCorrect(val)}
                    >
                      <RadioGroupItem
                        value={opt}
                        id={`radio-${idx}`}
                        checked={qData.correct === opt}
                      />
                    </RadioGroup>
                  ) : (
                    <Checkbox
                      checked={
                        Array.isArray(qData.correct) &&
                        qData.correct.includes(opt)
                      }
                      onCheckedChange={() => toggleCorrect(opt)}
                    />
                  )}
                  <Input
                    className="w-full"
                    value={opt}
                    placeholder={`Option ${idx + 1}`}
                    onChange={(e) => updateOption(idx, e.target.value)}
                  />
                  {qData.options && qData.options.length > 2 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveOption(idx)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              {qData.options && qData.options.length < 4 && (
                <Button
                  type="button"
                  variant={"link"}
                  onClick={handleAddOption}
                >
                  Add Option
                </Button>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant={"outline"}
              onClick={() => {
                setIsOpen(false);
                setError(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Save Question</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
