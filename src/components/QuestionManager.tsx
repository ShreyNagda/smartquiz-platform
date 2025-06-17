import React from "react";

interface IQuestionManager {
  questions: {
    qid: string;
    text: string;
    options: string[];
    correct: string;
  }[];
}
export default function QuestionManager(props: IQuestionManager) {
  console.log(props.questions);
  return <div>Question Manager</div>;
}
