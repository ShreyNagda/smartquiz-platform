"use client";

import { usePathname } from "next/navigation";
import LoginButton from "./Buttons/LoginButton";
import ProfileButton from "./Buttons/ProfileButton";
import { type Session } from "next-auth";
import LogoutButton from "./Buttons/LogoutButton";

type Props = {
  session: Session; // you can type it more strictly if needed
};

export default function HeaderActions({ session }: Props) {
  const pathname = usePathname();
  const isDashboard = pathname.endsWith("/dashboard");

  return (
    <nav className="flex gap-2 items-center">
      {!session ? (
        <LoginButton />
      ) : !isDashboard ? (
        <ProfileButton />
      ) : (
        <LogoutButton />
      )}
    </nav>
  );
}
