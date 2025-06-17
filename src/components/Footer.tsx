import React from "react";

export default function Footer() {
  return (
    <footer className="text-center p-4">
      &copy; {new Date().getFullYear()} SmartQuiz
    </footer>
  );
}
