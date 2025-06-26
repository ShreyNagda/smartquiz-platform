"use client";

import React from "react";
import { Card, CardContent } from "./ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Button } from "./ui/button";
import { BsPrinter } from "react-icons/bs";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { useQRCode } from "next-qrcode";

type OverviewData = {
  numberOfQuestions: number;
  numberOfResponses: number;
  accessMode: string;
  access: string;
  code?: string;
  id: string;
};

export default function Overview(overviewData: OverviewData) {
  const data = [
    { title: "Questions", value: overviewData.numberOfQuestions },
    { title: "Responses", value: overviewData.numberOfResponses },
  ];

  const { SVG } = useQRCode();

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="text-lg font-semibold my-2">Overview</div>

        <div className="flex items-center gap-2 text-primary">
          {/* <div className="capitalize">{quizData.status}</div> */}
          <Tooltip>
            <TooltipTrigger asChild>
              {/* TODO implement the print button */}
              <Button type="button" variant={"link"} size={"icon"}>
                <Link href={`/quiz/${overviewData.id}?preview=true`}>
                  <ArrowUpRight />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Preview</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              {/* TODO implement the print button */}
              <Button type="button" variant={"link"} size={"icon"}>
                <BsPrinter />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Print</TooltipContent>
          </Tooltip>
        </div>
      </div>
      {/* <div>Title</div> */}
      <div className="flex justify-start items-center flex-col md:flex-row gap-2 md:gap-4">
        <div className="flex gap-2 flex-col order-2 md:order-none">
          <div className="flex items-center justify-center md:justify-start gap-1">
            {data.map((d) => (
              <Card key={d.title} className="px-3 py-2">
                <CardContent className="px-0 flex flex-col justify-between items-center ">
                  <div className="text-sm">{d.title}</div>
                  <div className="md:text-xl">{d.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="capitalize mt-2 px-2">
            Access Mode: {overviewData.accessMode}
          </p>
          {overviewData.accessMode === "private" && (
            <p className="px-2">Code: {overviewData.code!}</p>
          )}
        </div>
        <div className="order-1 md:order-none">
          <SVG
            text={overviewData.access}
            options={{
              margin: 2,
              width: 200,
              color: {
                dark: "#000",
              },
            }}
          />
        </div>
      </div>
    </>
  );
}
