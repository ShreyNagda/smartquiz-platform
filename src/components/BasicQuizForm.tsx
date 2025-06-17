"use client";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { ScrollArea } from "./ui/scroll-area";
import { Switch } from "./ui/switch";

type QuizFormProps = {
  initialQuizData?: {
    title: string;
    desc?: string;
    randomizeQuestions?: boolean;
    userDetailsRequired?: boolean;
  };
};

export default function BasicQuizForm({ initialQuizData }: QuizFormProps) {
  const [quizData, setQuizData] = useState({
    ...initialQuizData,
    randomizeQuestions: initialQuizData?.randomizeQuestions || false,
    userDetailsRequired: initialQuizData?.userDetailsRequired || false,
  });
  return (
    <>
      <ScrollArea className="h-[360px] md:h-[460px]">
        <div className="my-2">Basic Settings</div>
        <form className="space-y-2">
          <Label>Title</Label>
          <Input
            type="text"
            className="outline-none border-b-2 border-none rounded-xs bg-transparent"
            value={quizData?.title}
            onChange={(ev) =>
              setQuizData({ ...quizData, title: ev.target.value })
            }
            name="title"
          />
          <Label>Description</Label>
          <Textarea
            className="outline-none border-b-2 border-none rounded-xs bg-transparent"
            value={quizData?.desc}
            rows={10}
            onChange={(ev) =>
              setQuizData({ ...quizData, desc: ev.target.value })
            }
          />
          <div className="flex flex-wrap justify-between gap-3 p-0 md:py-2 ">
            <>
              <Label className="w-full md:w-fit flex justify-between">
                Randomize Questions{" "}
                <Switch
                  checked={quizData.randomizeQuestions || false}
                  onCheckedChange={(value) =>
                    setQuizData({ ...quizData, randomizeQuestions: value })
                  }
                />
              </Label>
            </>

            <>
              <Label className="w-full md:w-fit flex justify-between">
                Require User Details
                <Switch
                  checked={quizData.userDetailsRequired || false}
                  onCheckedChange={(value) =>
                    setQuizData({ ...quizData, userDetailsRequired: value })
                  }
                />
              </Label>
            </>
          </div>
          <Button type="submit">
            {initialQuizData ? "Save Quiz" : "Create Quiz"}
          </Button>
        </form>
      </ScrollArea>
    </>
  );
}
