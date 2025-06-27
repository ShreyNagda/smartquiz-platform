"use client";
import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { MdErrorOutline } from "react-icons/md";
// import { IQuiz } from "@/models/Quiz";
import Link from "next/link";

interface IQuizCard {
  _id: string;
  title: string;
  desc?: string;
  questions: object[];
  responses: object[];
  status: string;
}

export default function DashboardQuizCard({ q }: { q: IQuizCard }) {
  return (
    <Link href={`/dashboard/quiz/${q._id}`}>
      <Card className="bg-card gap-4 sm:max-w-[400px]">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="text-lg md:text-xl font-semibold ">{q.title}</div>
            {q.questions.length === 0 && (
              <Tooltip>
                <TooltipTrigger className="text-primary">
                  <MdErrorOutline />
                </TooltipTrigger>
                <TooltipContent>
                  <p>No Questions</p>
                </TooltipContent>
              </Tooltip>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap justify-between items-center">
          <div>Questions: {q.questions.length}</div>
          <div>Responses: {q.responses.length}</div>
        </CardContent>
        <CardFooter>
          <div className="uppercase text-sm text-primary">{q.status}</div>
        </CardFooter>
      </Card>
    </Link>
  );
}
