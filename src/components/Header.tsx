"use client";
import React from "react";
import HeaderActions from "./HeaderActions";
import { Session } from "next-auth";

type Props = {
  session: Session | null; // Accept null for unauthenticated state
};
export default function Header({ session }: Props) {
  return (
    <header className="flex items-center justify-between p-4">
      {/* Header client component */}
      <HeaderActions session={session!} />
    </header>
  );
}
