"use client";

import React from "react";
import { Button } from "../ui/button";
import { Types } from "mongoose";
import { redirect } from "next/navigation";

export default function AddQuizButton() {
  return (
    <Button
      type="button"
      onClick={() => {
        const newId = new Types.ObjectId();
        redirect(`/dashboard/quiz/${newId}`);
      }}
    >
      Create Quiz
    </Button>
  );
}
