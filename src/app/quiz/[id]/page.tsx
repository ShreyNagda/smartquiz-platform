"use client";

import BackButton from "@/components/Buttons/BackButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { IQuiz } from "@/models/Quiz";
import { redirect, useParams, useRouter } from "next/navigation";
import React, { FormEvent, useEffect, useState } from "react";
import { LuLoader } from "react-icons/lu";
import { toast } from "sonner";

type UserData = {
  name: string;
  details?: {
    id: string;
    class?: string;
  };
  code?: string;
};

export default function ClientQuizPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState<IQuiz | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/quiz`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
          }
        );

        if (!res.ok) router.replace(`/error/No Quiz Found`);

        const data: IQuiz = await res.json();
        setQuizData(data);
      } catch (error) {
        console.error(error);
        setQuizData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [id, router]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LuLoader className="animate-spin text-2xl" />
      </div>
    );
  }

  if (!quizData) {
    redirect("/error/No-Quiz-Found");
  }

  const isPublic = quizData.accessMode === "public";

  const handleStartQuiz = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (userData === null) {
      toast.error("Enter required details");
    }
    if (userData?.code !== quizData.access) {
      toast.error("Invalid code");
    }
    const allowAccess = !isPublic ? userData?.code === quizData.access : true;

    if (allowAccess && userData != null) console.log(userData);
  };

  return (
    <section className="h-screen w-full p-4 flex items-center">
      <Card className="p-4 text-center w-full max-w-[600px] mx-auto">
        <CardTitle className="text-2xl">{quizData.title}</CardTitle>
        <CardDescription>{quizData.desc}</CardDescription>
        <CardContent>
          {quizData.status !== "live" ? (
            <>
              <div className="text-red-400">
                Quiz is not live. Please contact administrator
              </div>
              <BackButton to="/" />
            </>
          ) : (
            <form className="space-y-2" onSubmit={handleStartQuiz}>
              <Input
                type="text"
                placeholder="Enter name"
                required
                onChange={(ev) =>
                  setUserData((prev) => ({ ...prev, name: ev.target.value }))
                }
              />
              {quizData?.userDetailsRequired && (
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter id"
                    required
                    onChange={(ev) =>
                      setUserData((prev) => ({ ...prev, id: ev.target.value }))
                    }
                  />
                  <Input
                    type="text"
                    placeholder="Enter class"
                    required
                    onChange={(ev) =>
                      setUserData((prev) => ({
                        ...prev,
                        class: ev.target.value,
                      }))
                    }
                  />
                </div>
              )}
              {!isPublic && (
                <Input
                  type="text"
                  placeholder="Enter code"
                  required
                  onChange={(ev) =>
                    setUserData((prev) => ({ ...prev, code: ev.target.value }))
                  }
                />
              )}
              <Button type="submit">Start Quiz</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
