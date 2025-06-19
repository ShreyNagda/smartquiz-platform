import React from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import HeaderActions from "./HeaderActions";

export default async function Header() {
  const session = await auth();
  return (
    <header className="flex justify-between p-4">
      <Link href={"/"} className="text-2xl font-bold">
        SmartQuiz
      </Link>
      <HeaderActions session={session!} />
    </header>
  );
}
