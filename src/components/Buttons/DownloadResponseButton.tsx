"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { LuLoaderCircle } from "react-icons/lu";

type Props = {
  quiz: {
    title: string;
    questions: { qid: string; text: string }[];
  };
  user: {
    name: string;
    details?: { id?: string; class?: string };
  };
  score: number;
  maxScore: number;
  answers: { qid: string; answer: string | string[] }[];
};

export default function DownloadResponsePDFButton(props: Props) {
  const generatePDF = () => {
    setLoading(true);

    const doc = new jsPDF();
    const { score, maxScore, quiz, answers, user } = props;
    const { title, questions } = quiz;

    // Header
    doc.setFontSize(16);
    doc.text(title, 105, 20, { align: "center" });

    doc.setFontSize(12);
    let y = 30;

    doc.text(`Name: ${user.name}`, 14, y);
    y += 7;

    if (user.details?.class || user.details?.id) {
      if (user.details?.class) {
        doc.text(`Class: ${user.details.class}`, 14, y);
      }
      if (user.details?.id) {
        const idX = user.details?.class ? 100 : 14;
        doc.text(`ID: ${user.details.id}`, idX, y);
      }
      y += 7;
    }

    doc.text(`Score: ${score} / ${maxScore}`, 14, y);
    y += 10;

    // Table of Answers
    autoTable(doc, {
      startY: y,
      head: [["Q#", "Question", "Answer"]],
      body: answers.map((a, i) => [
        i + 1,
        questions.find((q) => q.qid === a.qid)?.text || "N/A",
        Array.isArray(a.answer) ? a.answer.join(", ") : a.answer,
      ]),
    });

    doc.save(`${user.name}_quiz_result.pdf`);
    setLoading(false);
  };
  const [loading, setLoading] = useState(false);
  return (
    <Button
      variant="outline"
      onClick={() => generatePDF()}
      className="min-w-[150px]"
    >
      {loading ? (
        <LuLoaderCircle className="animate-spin" />
      ) : (
        "Download response"
      )}
    </Button>
  );
}
