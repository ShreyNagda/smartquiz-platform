import React from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";

export default async function Header() {
  const session = await auth();
  return (
    <header className="flex justify-between py-4 lg:px-0">
      <Link href={"/"} className="text-2xl font-bold">
        SmartQuiz
      </Link>
      <nav className="flex gap-2 items-center">
        {!session ? (
          <>
            <LoginButton />
          </>
        ) : (
          <>
            <LogoutButton />
          </>
        )}
      </nav>
    </header>
  );
}
