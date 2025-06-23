"use client";

import { usePathname, useRouter } from "next/navigation";
import LoginButton from "./Buttons/LoginButton";
import ProfileButton from "./Buttons/ProfileButton";
import { type Session } from "next-auth";
import LogoutButton from "./Buttons/LogoutButton";
import { Button } from "./ui/button";
import Link from "next/link";

type Props = {
  session: Session | null; // Accept null for unauthenticated state
};

function ActionButton({
  session,
  isPreview,
  isQuiz,
  isDashboard,
  router,
}: {
  session: Session | null;
  isPreview: boolean;
  isQuiz: boolean;
  isDashboard: boolean;
  router: ReturnType<typeof useRouter>;
}) {
  if (isQuiz) {
    return <></>;
  }
  if (!session) {
    return <LoginButton />;
  }

  if (isPreview) {
    return (
      <Button type="button" onClick={() => router.back()}>
        Back to dashboard
      </Button>
    );
  }

  if (!isDashboard) {
    if (isQuiz) {
      return <></>;
    }
    return <ProfileButton />;
  }
  return <LogoutButton />;
}

export default function HeaderActions({ session }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const isDashboard =
    pathname.endsWith("/dashboard") || pathname.includes("dashboard");
  const isPreview = pathname.endsWith("/preview");

  const isQuizPage = pathname.startsWith("/quiz");

  if (isQuizPage) {
    return <></>;
  }
  return (
    <nav className="w-full flex justify-between gap-2 items-center">
      <Link href={"/"} className="text-2xl font-bold">
        SmartQuiz
      </Link>
      <ActionButton
        session={session}
        isPreview={isPreview}
        isQuiz={isQuizPage}
        isDashboard={isDashboard}
        router={router}
      />
    </nav>
  );
}
