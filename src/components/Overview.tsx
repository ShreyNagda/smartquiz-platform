import React from "react";
import { Card, CardContent } from "./ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Button } from "./ui/button";
import { BsPrinter } from "react-icons/bs";
import Link from "next/link";

type OverviewData = {
  numberOfQuestions: number;
  numberOfResponses: number;
  accessMode: string;
  access: string;
  id: string;
};

export default function Overview(overviewData: OverviewData) {
  const data = [
    { title: "Questions", value: overviewData.numberOfQuestions },
    { title: "Responses", value: overviewData.numberOfResponses },
  ];

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
                <BsPrinter />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Print</TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {data.map((d) => (
          <Card key={d.title} className="flex-1 bg-card">
            <CardContent className="flex flex-col md:flex-row justify-between items-center md:text-xl">
              <div>{d.title}</div>
              <div className="text-xl">{d.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="py-1">
        <div className="inline-flex">
          Access Mode:{" "}
          <p className="capitalize">&nbsp;{overviewData.accessMode}</p>
        </div>
        <div className="flex-wrap">
          <p className="min-w-[200px] truncate">{overviewData.access}</p>
        </div>
      </div>

      <Button type="button" variant={"link"}>
        <Link href={`${overviewData.id}/preview`}>Preview</Link>
      </Button>
    </>
  );
}
