import BasicQuizForm from "@/components/Forms/BasicQuizForm";
import { auth } from "@/lib/auth";
import { createQuiz } from "@/lib/helpers/quiz";
import { redirect } from "next/navigation";
import React from "react";

export default function CreateNewQuiz() {
  async function createNewQuiz(data: {
    title: string;
    desc?: string;
    randomizeQuestions?: boolean;
    userDetailsRequired?: boolean;
    access?: string;
    code?: string;
  }) {
    "use server";
    const session = await auth();
    const hostId = session?.user?.id;
    if (!hostId) redirect("/error/not-signed-in");
    const res = await createQuiz({ ...data, hostId });
    redirect(`/dashboard/quiz/${res._id}`);
  }
  return (
    <>
      <BasicQuizForm setData={createNewQuiz} />
    </>
  );
}
