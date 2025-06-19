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

export default function DashboardNavigation() {
  const [sheetState, setSheetState] = useState(false);

  const tabs = [
    { title: "Overview", value: "overview" },
    { title: "Basic Settings", value: "basic" },
    { title: "Question Manager", value: "questions" },
    { title: "Time Settings", value: "time" },
    { title: "Responses", value: "responses" },
  ];

  return (
    <>
      <TabsList className="hidden md:flex gap-4 mb-4">
        {tabs.map((tab) => (
          <TabsTrigger value={tab.value} key={tab.value}>
            {tab.title}
          </TabsTrigger>
        ))}
        <Button>Activate Quiz</Button>
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
              <Button>Activate Quiz</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
