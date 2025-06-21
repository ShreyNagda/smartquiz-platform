import React from "react";

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
}) => (
  <div className="flex gap-2 justify-center my-4">
    {Array.from({ length: total }).map((_, idx) => (
      <button
        key={idx}
        onClick={() => onNavigate(idx)}
        disabled={submitted}
        className={`w-8 h-8 rounded-full border-2 font-semibold
          ${
            idx === current
              ? "bg-blue-500 text-white border-blue-700"
              : "bg-white text-blue-700 border-blue-300"
          }
          ${submitted ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-100"}
        `}
        aria-label={`Go to question ${idx + 1}`}
      >
        {idx + 1}
      </button>
    ))}
  </div>
);

export default QuestionNavigator;
