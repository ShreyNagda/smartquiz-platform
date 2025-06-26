"use client";

import { useState, useEffect, FormEvent } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { LuLoaderCircle } from "react-icons/lu";
import { toast } from "sonner";

import BackButton from "@/components/Buttons/BackButton";
import QuizAttemptPage from "@/components/QuizAttempt";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { IQuiz } from "@/models/Quiz";
// import { FaInfoCircle } from "react-icons/fa";

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
  const searchParams = useSearchParams();
  const router = useRouter();
  const codeFromURL = searchParams.get("code");

  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState<IQuiz | null>(null);
  const [userData, setUserData] = useState<UserData>({
    name: "",
    code: codeFromURL || "",
  });
  const [startQuiz, setStartQuiz] = useState(false);

  useEffect(() => {
    const attempted = JSON.parse(localStorage.getItem("quizzes") || "[]");
    if (attempted.includes(id)) {
      router.replace("/error/AlreadyAttempted");
      return;
    }

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

        if (!res.ok) {
          router.replace("/error/No-Quiz-Found");
          return;
        }

        const data: IQuiz = await res.json();
        setQuizData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [id, router]);

  const handleStartQuiz = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userData.name) return toast.error("Please enter your name");
    if (!quizData) return;

    const isCorrectCode =
      quizData.accessMode === "public" || userData.code === quizData.code;
    if (!isCorrectCode) return toast.error("Invalid quiz code");

    if (
      quizData.responses.filter(
        (res) =>
          res.name === userData.name &&
          res.details &&
          res.details.id === userData.details?.id
      ).length > 0
    ) {
      return toast.error("Already responded");
    }
    setStartQuiz(true);
  };

  if (loading) {
    return (
      <div className="h-svh flex items-center justify-center">
        <LuLoaderCircle className="animate-spin text-2xl" />
      </div>
    );
  }

  if (!quizData) return null;
  if (startQuiz)
    return <QuizAttemptPage quizData={quizData} userData={userData} />;

  return (
    <section className="w-full p-4 flex flex-col justify-center items-center">
      <Card className="p-4 w-full max-w-xl mx-auto text-center">
        <CardTitle className="text-2xl">{quizData.title}</CardTitle>
        <CardDescription>{quizData.desc}</CardDescription>
        <CardContent>
          {quizData.status !== "live" ? (
            <>
              <div className="text-red-500 mb-4">
                Quiz is not live. Contact admin.
              </div>
              <BackButton to="/" />
            </>
          ) : (
            <form className="space-y-3" onSubmit={handleStartQuiz}>
              <Input
                placeholder="Enter name"
                required
                value={userData.name}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
              {quizData.userDetailsRequired && (
                <div className="flex flex-col md:flex-row gap-2">
                  <Input
                    placeholder="Enter ID"
                    required
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        details: { ...prev.details, id: e.target.value },
                      }))
                    }
                  />
                  <Input
                    placeholder="Enter class"
                    required
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        details: { ...prev.details, class: e.target.value },
                      }))
                    }
                  />
                </div>
              )}
              {quizData.accessMode !== "public" && (
                <Input
                  placeholder="Enter code"
                  required
                  value={userData.code}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, code: e.target.value }))
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
