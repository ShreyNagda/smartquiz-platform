"use client";

import React from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { useQRCode } from "next-qrcode";
import DownloadTestSheetButton from "./Buttons/DownloadTestSheetButton";
import { IQuiz } from "@/models/Quiz";
import { BsShare } from "react-icons/bs";

type Quiz = {
  numberOfQuestions: number;
  numberOfResponses: number;
  quiz: IQuiz;
};

export default function Overview({ quiz, ...overviewData }: Quiz) {
  const data = [
    { title: "Questions", value: overviewData.numberOfQuestions },
    { title: "Responses", value: overviewData.numberOfResponses },
  ];

  const { SVG } = useQRCode();

  return (
    <section className="w-full rounded-2xl space-y-2">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Overview</h2>
        <div className="flex items-center gap-2 text-primary">
          <Button variant={"ghost"}>
            <BsShare />
          </Button>

          <DownloadTestSheetButton quiz={quiz} />
        </div>
      </div>

      {/* Stats + QR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Stats */}
        <div className="col-span-2 flex flex-col gap-4">
          <div className="flex gap-4">
            {data.map((item) => (
              <Card key={item.title} className="flex-1">
                <CardContent className="py-4 px-2 flex flex-col items-center justify-center">
                  <div className="text-sm text-gray-400">{item.title}</div>
                  <div className="text-xl font-bold text-gray-300">
                    {item.value}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="px-2 space-y-1">
            <p className="capitalize text-sm text-gray-600">
              Access Mode:{" "}
              <span className="font-medium text-gray-800">
                {quiz.accessMode}
              </span>
            </p>
            {quiz.accessMode === "private" && (
              <p className="text-sm text-gray-600">
                Code:{" "}
                <span className="font-mono text-gray-800">{quiz.code}</span>
              </p>
            )}
          </div>
        </div>

        {/* QR Code */}
        <div className="flex justify-center items-center">
          <SVG
            text={
              quiz.access ||
              `${process.env.NEXT_PUBLIC_BASE_URL}/quiz/${quiz._id}`
            }
            options={{
              margin: 2,
              width: 180,
              color: {
                dark: "#000000",
                light: "#ffffff00",
              },
            }}
          />
        </div>
      </div>
    </section>
  );
}
