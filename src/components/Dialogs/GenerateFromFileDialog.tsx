"use client";

import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { FaFile } from "react-icons/fa";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type Question = {
  qid: string;
  type: "single" | "multiple" | "short";
  text: string;
  options?: string[];
  correct?: string[] | string;
  marks?: number;
};

export default function GenerateFromFileDialog({
  onImport,
}: {
  onImport: (questions: Question[]) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

  const validateQuestion = (q: Question): q is Question => {
    console.log(q);
    const validTypes = ["single", "multiple", "short"];
    if (!q.text || !validTypes.includes(q.type)) return false;
    if (
      (q.type === "single" || q.type === "multiple") &&
      !Array.isArray(q.options)
    )
      return false;
    if (!q.correct) return false;
    return true;
  };

  const parseFile = async (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    const reader = new FileReader();

    return new Promise<Question[]>((resolve, reject) => {
      reader.onload = (e) => {
        try {
          let parsed: Question[] = [];

          if (ext === "json") {
            parsed = JSON.parse(e.target?.result as string);
          } else {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            parsed = XLSX.utils.sheet_to_json(sheet);
          }

          // Preprocess each question
          const cleaned: Question[] = parsed.map((q) => {
            const cleanedQuestion: Question = {
              qid: q.qid || Math.random().toString(36).substring(2, 6),
              type: q.type,
              text: q.text,
              marks: q.marks ? Number(q.marks) : undefined,
              options:
                typeof q.options === "string"
                  ? String(q.options)
                      .split(",")
                      .map((opt) => opt.trim())
                  : Array.isArray(q.options)
                  ? q.options
                  : undefined,

              correct:
                typeof q.correct === "string" && q.type !== "short"
                  ? String(q.correct)
                      .split(",")
                      .map((c) => c.trim())
                  : Array.isArray(q.correct)
                  ? q.correct
                  : String(q.correct) ?? undefined,
            };

            // If it's single-type, convert correct to string instead of array
            if (
              cleanedQuestion.type === "single" &&
              Array.isArray(cleanedQuestion.correct)
            ) {
              cleanedQuestion.correct = cleanedQuestion.correct[0];
            }

            return cleanedQuestion;
          });

          const validQuestions = cleaned.filter(validateQuestion);

          if (validQuestions.length === 0) {
            toast.error("No valid questions found in file. Check templates");
            reject("Invalid file format");
            setOpen(false);
            return;
          }

          resolve(validQuestions);
        } catch (err) {
          toast.error("Error parsing file");
          reject(err);
        }
      };

      if (ext === "json") reader.readAsText(file);
      else reader.readAsArrayBuffer(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFile(file);

    const validExt = ["json", "csv", "xlsx"];
    if (!validExt.includes(file.name.split(".").pop()!)) {
      toast.error("Unsupported file type");
      return;
    }

    try {
      const questions = await parseFile(file);
      toast.success(`Imported ${questions.length} valid question(s)`);
      // onImport(questions);
      setQuestions(questions);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start rounded-sm">
          <FaFile className="mr-2" /> Import from file
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Add questions from File</DialogTitle>
        <DialogDescription>
          Upload a `.json`, `.csv`, or `.xlsx` file with valid question format.
        </DialogDescription>

        <Input
          type="file"
          ref={fileInputRef}
          accept=".json,.csv,.xlsx"
          onChange={handleFileChange}
          className="hidden"
          id="input"
        />
        <Label htmlFor="input" className="cursor-pointer">
          {file?.name || " Upload File"}
        </Label>

        {questions.length > 0 && <p>{questions.length} valid questions</p>}
        <Button
          onClick={() => {
            console.log(questions);
            onImport(questions);
            setOpen(false);
          }}
        >
          Add Questions
        </Button>
      </DialogContent>
    </Dialog>
  );
}
