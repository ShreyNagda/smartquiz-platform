"use client";
import React from "react";
import { Session } from "next-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LoginButton from "./Buttons/LoginButton";
import DashboardButton from "./Buttons/DashboardButton";
import LogoutButton from "./Buttons/LogoutButton";
import BackButton from "./Buttons/BackButton";

type Props = {
  session: Session | null; // Accept null for unauthenticated state
};
export default function Header({ session }: Props) {
  const pathName = usePathname();
  console.log(pathName);

  const showLoginButton = !session;
  const showDashboardButton: boolean =
    session !== null && !pathName.includes("/dashboard");
  const showLogoutButton = session && pathName.includes("/dashboard");
  return (
    <header className="flex items-center justify-between md:p-8 p-3">
      <Link href={"/"} className="text-2xl font-bold">
        SmartQuiz
      </Link>
      <div className="flex items-center gap-4">
        {showLoginButton && <LoginButton />}
        {showDashboardButton && <DashboardButton />}
        {showLogoutButton && (
          <>
            {showDashboardButton && <BackButton to="/" />}
            <LogoutButton />
          </>
        )}
      </div>
    </header>
  );
}
