import BasicQuizForm from "@/components/BasicQuizForm";
import { auth } from "@/lib/auth";
import { createQuiz } from "@/lib/helpers/quiz";
import { redirect } from "next/navigation";
import React from "react";

export default function CreateNewQuiz() {
  const code = Math.random().toString(36).substring(2, 9);
  async function createNewQuiz(data: {
    title: string;
    desc?: string;
    randomizeQuestions?: boolean;
    userDetailsRequired?: boolean;
  }) {
    "use server";
    console.log(data);
    const session = await auth();
    const hostId = session?.user?.id;
    console.log(hostId);
    if (!hostId) redirect("/error/not-signed-in");
    const res = await createQuiz({ ...data, hostId });
    redirect(`/dashboard/quiz/${res._id}`);
  }
  return (
    <>
      <BasicQuizForm
        setData={createNewQuiz}
        initialQuizData={{ title: "", accessMode: "private", access: code }}
      />
    </>
  );
}
