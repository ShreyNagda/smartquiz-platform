"use client";
import React from "react";

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
  submittedAt: Date;
};

export default function QuizResponseTable({
  responses,
}: {
  responses: Response[];
}) {
  console.log(responses);
  return (
    <div>
      <div className="my-2 text-lg font-semibold">Responses</div>
      {/* <Table></Table> */}
    </div>
  );
}
