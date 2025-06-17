import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default async function ErrorPage({
  params,
}: {
  params: Promise<{ error: string }>;
}) {
  const { error } = await params;
  return (
    <>
      <div>Error: {error}</div>
      <Button asChild>
        <Link href={"/"}>Back to Home</Link>
      </Button>
    </>
  );
}
