"use client";
import React, { ChangeEvent, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { LuLoader } from "react-icons/lu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Copy } from "lucide-react";
import { toast } from "sonner";

type Data = {
  title: string;
  desc?: string;
  accessMode: string;
  access: string;
  randomizeQuestions?: boolean;
  userDetailsRequired?: boolean;
};

type Props = {
  initialQuizData?: Data;
  _id?: string;
  setData: (data: Data) => void;
};

export default function BasicQuizForm({
  initialQuizData,
  setData,
  _id,
}: Props) {
  const [quizData, setQuizData] = useState(
    initialQuizData || {
      title: "",
      desc: "",
      accessMode: "private",
      access: "",
    }
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setData(quizData);
    await new Promise((res) => setTimeout(res, 500));
    setLoading(false);
  };

  const handleChange = (name: string, value: string | boolean) => {
    setQuizData((prev) => ({ ...prev, [name]: value }));
  };

  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/quiz/${_id}`;
  return (
    <>
      <div className="my-2 text-lg font-semibold">Basic Settings</div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            type="text"
            value={quizData?.title}
            name="title"
            onChange={(ev: ChangeEvent<HTMLInputElement>) =>
              handleChange("title", ev.target.value)
            }
          />
        </div>

        <div>
          <Label htmlFor="desc">Description</Label>
          <Textarea
            id="desc"
            name="desc"
            value={quizData?.desc}
            rows={6}
            onChange={(ev: ChangeEvent<HTMLTextAreaElement>) =>
              handleChange("desc", ev.target.value)
            }
          />
        </div>

        <div className="">
          <Label>Access Mode</Label>
          <div className="flex gap-2 items-center">
            <Select
              defaultValue={quizData.accessMode}
              onValueChange={(value) => {
                handleChange("accessMode", value);
                if (value === "public") {
                  handleChange("access", url);
                } else {
                  handleChange("access", quizData.access!);
                }
              }}
            >
              <SelectTrigger className="w-[100px] justify-between border p-1">
                <SelectValue className="w-full"></SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="public">Public</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center">
              {quizData.accessMode === "public" ? (
                <>
                  {_id !== undefined && (
                    <>
                      {url}
                      <Button
                        variant="link"
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(url);
                          toast.success("Quiz link copied to clipboard");
                        }}
                      >
                        <Copy />
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <>
                  {quizData.access}
                  <Button
                    variant="link"
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(quizData.access!);
                      toast.success("Quiz access copied to clipboard");
                    }}
                  >
                    <Copy />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 md:flex-row md:gap-6">
          <div className="flex items-center justify-between md:justify-start md:gap-4">
            <Label>Randomize Questions</Label>
            <Switch
              checked={quizData.randomizeQuestions || false}
              onCheckedChange={(value) =>
                handleChange("randomizeQuestions", value)
              }
            />
          </div>

          <div className="flex items-center justify-between md:justify-start md:gap-4">
            <Label>Require User Details</Label>
            <Switch
              checked={quizData.userDetailsRequired || false}
              onCheckedChange={(value) =>
                handleChange("userDetailsRequired", value)
              }
            />
          </div>
        </div>

        <Button type="submit" disabled={loading} className="min-w-[150px]">
          {loading ? (
            <LuLoader className="animate-spin h-5 w-5" />
          ) : initialQuizData ? (
            "Save Quiz"
          ) : (
            "Create Quiz"
          )}
        </Button>
      </form>
    </>
  );
}
