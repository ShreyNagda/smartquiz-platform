import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { FaFile } from "react-icons/fa";

export default function GenerateFromFileDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start rounded-sm">
          <FaFile /> Import from file
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Add questions from File</DialogTitle>
        <DialogDescription>
          Add multiple questions using a file
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
