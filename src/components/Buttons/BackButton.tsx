"use client";

import React from "react";
import { Button } from "../ui/button";
import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

export default function BackButton({ showDialog }: { showDialog?: boolean }) {
  const router = useRouter();
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant={"link"}
            onClick={() => !showDialog && router.replace("/dashboard")}
          >
            <IoIosArrowBack /> Back
          </Button>
        </AlertDialogTrigger>
        {showDialog && (
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              You have unsaved changes. Do you want to go back?
            </AlertDialogDescription>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.replace("/dashboard")}>
              Yes
            </AlertDialogAction>
          </AlertDialogContent>
        )}
      </AlertDialog>
    </>
  );
}
