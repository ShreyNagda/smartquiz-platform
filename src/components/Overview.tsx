import React from "react";
import { Card, CardContent } from "./ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Button } from "./ui/button";
import { BsPrinter } from "react-icons/bs";

type OverviewData = {
  numberOfQuestions: number;
  numberOfResponses: number;
  accessMode: string;
  access: string;
};

export default function Overview(overviewData: OverviewData) {
  const data = [
    { title: "Questions", value: overviewData.numberOfQuestions },
    { title: "Responses", value: overviewData.numberOfResponses },
  ];

  console.log(process.env.BASE_URL);
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
      <div className="flex gap-2">
        {data.map((d) => (
          <Card key={d.title} className="flex-1 bg-card">
            <CardContent className="flex justify-between items-center">
              <div>{d.title}</div>
              <div>{d.value}</div>
            </CardContent>
          </Card>
        ))}
        {/* <Card className="flex-1 bg-card">
        <CardContent className="flex justify-between items-center">
          <div>Questions</div>
          <div>{data.questions.length}</div>
        </CardContent>
      </Card>
      <Card className="flex-1">
        <CardContent>
          <CardContent className="flex justify-between items-center">
            <div>Responses</div>
            <div>{quizData.responses.length}</div>
          </CardContent>
        </CardContent>
      </Card> */}
      </div>
      <div>
        <div>Access Mode: {overviewData.accessMode}</div>
        <div>Access : {overviewData.access}</div>
      </div>
    </>
  );
}
