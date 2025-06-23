"use client";

import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from "react";
import { IoMenu } from "react-icons/io5";
import { Button } from "./ui/button";
import {
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetFooter,
  Sheet,
} from "./ui/sheet";
import { toast } from "sonner";
import { LuLoader } from "react-icons/lu";
import { redirect } from "next/navigation";
import BackButton from "./Buttons/BackButton";

export default function DashboardNavigation({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const [loading, setLoading] = useState(false);
  const [sheetState, setSheetState] = useState(false);

  const tabs = [
    { title: "Overview", value: "overview" },
    { title: "Basic Settings", value: "basic" },
    { title: "Question Manager", value: "questions" },
    { title: "Time Settings", value: "time" },
    { title: "Responses", value: "responses" },
  ];

  const activateQuiz = async () => {
    setLoading(true);
    const res = await fetch(`/api/quiz/${id}/activate`);
    await new Promise((res) => setTimeout(res, 500));
    const { status, message } = await res.json();
    if (status == 200) {
      toast.success(message);
    }
    setLoading(false);
    redirect("");
  };

  const deactivateQuiz = async () => {
    setLoading(true);
    const res = await fetch(`/api/quiz/${id}/deactivate`);
    await new Promise((res) => setTimeout(res, 500));
    const { status, message } = await res.json();
    if (status == 200) {
      toast.success(message);
    }
    setLoading(false);
    redirect("");
  };

  return (
    <>
      <TabsList className="hidden md:flex gap-4 mb-4">
        <BackButton />
        {tabs.map((tab) => (
          <TabsTrigger value={tab.value} key={tab.value}>
            {tab.title}
          </TabsTrigger>
        ))}
        <Button
          className="w-[150px]"
          onClick={status === "live" ? deactivateQuiz : activateQuiz}
        >
          {loading ? (
            <LuLoader className="animate-spin" />
          ) : status !== "live" ? (
            "Activate Quiz"
          ) : (
            "Close Quiz"
          )}
        </Button>
      </TabsList>

      {/* Mobile Sheet Menu */}
      <div className="md:hidden mb-4">
        <Sheet modal={false} open={sheetState} onOpenChange={setSheetState}>
          <SheetTrigger className="p-2 border rounded-md shadow-sm">
            <IoMenu className="h-6 w-6" />
          </SheetTrigger>
          <SheetContent
            side="left"
            className="!absolute !left-0 w-64 overflow-y-auto shadow-2xl rounded-r-md border p-3"
          >
            <SheetTitle className="text-base font-semibold mb-3">
              Quiz Settings
            </SheetTitle>
            <TabsList className="flex flex-col items-start space-y-2">
              <BackButton />
              {tabs.map((tab) => (
                <TabsTrigger
                  value={tab.value}
                  key={tab.value}
                  onClick={() => setSheetState(false)}
                >
                  {tab.title}
                </TabsTrigger>
              ))}
            </TabsList>
            <SheetFooter>
              <Button
                className="w-[150px]"
                onClick={status === "live" ? deactivateQuiz : activateQuiz}
              >
                {loading ? (
                  <LuLoader className="animate-spin" />
                ) : status !== "live" ? (
                  "Activate Quiz"
                ) : (
                  "Close Quiz"
                )}
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
