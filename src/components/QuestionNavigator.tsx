import React from "react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type QuestionNavigatorProps = {
  total: number;
  current: number;
  onNavigate: (index: number) => void;
  submitted?: boolean;
};

const QuestionNavigator: React.FC<QuestionNavigatorProps> = ({
  total,
  current,
  onNavigate,
  submitted = false,
}) => {
  const getVisibleIndexes = () => {
    let start = Math.max(0, current - 2);
    let end = Math.min(total - 1, current + 2);

    // Ensure 5 buttons if possible
    if (end - start < 4) {
      if (start === 0) {
        end = Math.min(total - 1, start + 4);
      } else if (end === total - 1) {
        start = Math.max(0, end - 4);
      }
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visibleIndexes = getVisibleIndexes();

  return (
    <div className="flex flex-wrap gap-2 justify-center my-4">
      <Button
        variant={"outline"}
        className="w-8 h-8 rounded-sm font-semibold"
        disabled={current === 0}
        onClick={() => onNavigate(current - 1)}
      >
        <ChevronLeft />
      </Button>

      {visibleIndexes.map((idx) => (
        <Button
          key={idx}
          onClick={() => onNavigate(idx)}
          disabled={submitted}
          className={`w-8 h-8 rounded-sm font-semibold hover:bg-primary/20
            ${
              idx === current
                ? "bg-primary hover:bg-primary/70 text-white"
                : "bg-transparent border border-primary"
            }
          `}
          aria-label={`Go to question ${idx + 1}`}
        >
          {idx + 1}
        </Button>
      ))}

      <Button
        variant={"outline"}
        className="w-8 h-8 rounded-sm font-semibold"
        disabled={current === total - 1}
        onClick={() => onNavigate(current + 1)}
      >
        <ChevronRight />
      </Button>
    </div>
  );
};

export default QuestionNavigator;
