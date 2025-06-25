"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { LuLoader } from "react-icons/lu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";

type QuizTimeData = {
  timeMode: string;
  startsAt?: Date;
  endsAt?: Date;
  timeLimit: number;
};

type Props = {
  initialTimeData: QuizTimeData;
  isLive?: boolean;
  setData: (data: QuizTimeData) => void;
};

export default function TimeQuizForm({
  initialTimeData,
  setData,
  isLive = false,
}: Props) {
  const [timeData, setTimeData] = useState<QuizTimeData>(initialTimeData);
  const [loading, setLoading] = useState(false);

  const handleChange = (name: string, value: number | string) => {
    setTimeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLive) {
      toast.error("Quiz is live. Cannot edit");
      return;
    }
    setLoading(true);
    setData(timeData);
    await new Promise((res) => setTimeout(res, 500));
    setLoading(false);
  };

  return (
    <>
      <div className="my-2 text-lg font-semibold">Time Settings</div>
      <form className="my-4 space-y-4" onSubmit={handleSubmit}>
        <div>
          <Label className="block">Time Limit (in minutes) </Label>
          <Input
            type="number"
            value={timeData.timeLimit}
            onChange={(ev) => handleChange("timeLimit", ev.target.value)}
            name="timeLimit"
          />
        </div>

        <div className="flex items-center">
          <Label className="block">Start Mode: </Label>
          {/* <select
            onChange={(ev) => handleChange("timeMode", ev.target.value)}
            defaultValue={timeData.timeMode}
          >
            <option value="manual">Manual</option>
            <option value="auto" disabled>
              Automatic (coming soon)
            </option>
          </select> */}
          <Select
            onValueChange={(value) => handleChange("timeMode", value)}
            defaultValue={timeData.timeMode}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Time Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">Manual</SelectItem>
              <SelectItem value="auto" disabled>
                Automatic (Coming Soon)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* {quizData.timeMode === "auto" && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="startsAt">Start Time</Label>
              <Input
                id="startsAt"
                type="datetime-local"
                value={formatDateToLocalInput(quizData.startsAt)}
                onChange={(e) => handleDateChange("startsAt", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endsAt">End Time</Label>
              <Input
                id="endsAt"
                type="datetime-local"
                value={formatDateToLocalInput(quizData.endsAt)}
                onChange={(e) => handleDateChange("endsAt", e.target.value)}
              />
            </div>
          </div>
        )} */}
        <Button
          type="submit"
          disabled={isLive || loading || timeData === initialTimeData}
          className="min-w-[150px]"
        >
          {loading ? (
            <LuLoader className="animate-spin h-5 w-5" />
          ) : (
            "Save Quiz"
          )}
        </Button>
      </form>
    </>
  );
}
