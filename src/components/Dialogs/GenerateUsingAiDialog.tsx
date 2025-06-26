import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";

import { RiAiGenerate2 } from "react-icons/ri";

export default function GenerateUsingAiDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start rounded-sm">
          <RiAiGenerate2 /> Generate using AI
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Generate Using AI</DialogTitle>
        <DialogDescription>Add multiple questions using AI </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
