"use client";
import React, { ChangeEvent, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { LuLoaderCircle } from "react-icons/lu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { FaInfoCircle } from "react-icons/fa";

type Data = {
  title: string;
  desc?: string;
  accessMode: string;
  access: string;
  randomizeQuestions?: boolean;
  userDetailsRequired?: boolean;
  code: string;
};

type Props = {
  initialQuizData?: Data;
  _id?: string;
  isLive?: boolean;
  setData: (data: Data) => void;
};

export default function BasicQuizForm({
  initialQuizData,
  isLive = false,
  setData,
  _id,
}: Props) {
  const pathname = usePathname();
  const isNew = pathname.endsWith("/new");

  const router = useRouter();

  const [quizData, setQuizData] = useState(
    initialQuizData || {
      title: "",
      desc: "",
      accessMode: "private",
      access: "",
      code: Math.random().toString(36).substring(2, 8).toUpperCase(),
    }
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLive) {
      toast.error("Quiz is live. Cannot edit");
      return;
    }
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
            rows={3}
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
                  handleChange(
                    "code",
                    quizData.code ||
                      Math.random().toString(36).substring(2, 8).toUpperCase()
                  );
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
              {quizData.accessMode === "private" && (
                <>
                  Code: {quizData.code}
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

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={
              isLive || loading || (!isNew && initialQuizData === quizData)
            }
            className="min-w-[150px]"
          >
            {loading ? (
              <LuLoaderCircle className="animate-spin" />
            ) : isNew ? (
              "Create Quiz"
            ) : (
              "Save Quiz"
            )}
          </Button>
          {isLive && (
            <Tooltip>
              <TooltipTrigger>
                <FaInfoCircle className="fill-red-400" />
              </TooltipTrigger>
              <TooltipContent className="bg-red-400">
                Quiz is live. No changes can be made
              </TooltipContent>
            </Tooltip>
          )}
          {isNew && (
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </>
  );
}
