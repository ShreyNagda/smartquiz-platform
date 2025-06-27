// components/DownloadTestSheetButton.tsx
"use client";

import { Button } from "../ui/button";
import { LuLoaderCircle } from "react-icons/lu";
import { BsPrinter } from "react-icons/bs";
import { useState } from "react";
import jsPDF from "jspdf";

type Question = {
  qid: string;
  type: "single" | "multiple" | "short";
  text: string;
  options?: string[];
};

type Quiz = {
  title: string;
  desc?: string;
  questions: Question[];
};

export default function DownloadTestSheetButton({ quiz }: { quiz: Quiz }) {
  const [loading, setLoading] = useState(false);

  const generatePDF = () => {
    setLoading(true);
    const doc = new jsPDF();

    const { title, desc, questions } = quiz;

    doc.setFontSize(16);
    doc.text(title, 105, 20, { align: "center" });

    doc.setFontSize(12);
    let y = 30;

    if (desc) {
      const descLines = doc.splitTextToSize(desc, 180);
      doc.text(descLines, 14, y);
      y += descLines.length * 6 + 4;
    }

    const boxX = 14;
    const boxY = y;
    const boxWidth = 182;
    const boxHeight = 17;

    doc.rect(boxX, boxY, boxWidth, boxHeight); // Draw border

    y += 6;
    doc.text(`Name:`, boxX + 2, y);
    y += 7;
    doc.text(`Class:`, boxX + 2, y);
    doc.text(`ID:`, boxX + 100, y);
    y = boxY + boxHeight + 12; // Update y after box

    // Questions
    questions.forEach((q, index) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      const questionText = `${index + 1}. ${q.text}`;
      const lines = doc.splitTextToSize(questionText, 180);
      doc.text(lines, 14, y);
      y += lines.length * 6 + 2;

      if (q.type === "short") {
        // Add blank lines
        for (let i = 0; i < 3; i++) {
          doc.line(14, y, 196, y);
          y += 10;
        }
      } else if (q.options?.length) {
        q.options.forEach((option) => {
          doc.rect(14, y - 4, 5, 5); // Checkbox
          doc.text(option, 21, y);
          y += 8;
        });
      }

      y += 6;
    });

    doc.save(`${quiz.title}_test_sheet.pdf`);
    setLoading(false);
  };

  return (
    <Button variant="ghost" className="" onClick={async () => generatePDF()}>
      {loading ? <LuLoaderCircle className="animate-spin" /> : <BsPrinter />}
    </Button>
  );
}
