"use client";
import React from "react";
import * as XLSX from "xlsx";
import { Button } from "../ui/button";

type Answer = {
  qid: string;
  answer: string | string[];
};

type Response = {
  id: string;
  name: string;
  answers: Answer[];
  score: number;
  maxScore: number;
  submittedAt: Date | string;
};

export default function QuizResponseTable({
  responses,
}: {
  responses: Response[];
}) {
  const handleDownload = () => {
    const data = responses.map((res) => {
      // Flatten answers into a string for Excel
      // const answerMap: Record<string, string> = {};
      // res.answers.forEach((a) => {
      //   answerMap[`Q-${a.qid}`] = Array.isArray(a.answer)
      //     ? a.answer.join(", ")
      //     : a.answer;
      // });

      return {
        Name: res.name,
        Score: `${res.score}/${res.maxScore}`,
        "Submitted At": new Date(res.submittedAt).toLocaleString(),
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Quiz Responses");

    XLSX.writeFile(workbook, "quiz-responses.xlsx");
  };

  return (
    <div>
      <div className="flex justify-between p-2">
        <div className="my-2 text-lg font-semibold">Responses</div>
        <Button onClick={handleDownload}>Download as XLSX</Button>
      </div>

      <div className="overflow-y-auto">
        <table className="min-w-full table-auto border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Score</th>
              <th className="border px-4 py-2">Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {responses.map((res, idx) => (
              <tr key={idx}>
                <td className="border px-4 py-2">{res.name}</td>
                <td className="border px-4 py-2">
                  {res.score} / {res.maxScore}
                </td>
                <td className="border px-4 py-2">
                  {new Date(res.submittedAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
