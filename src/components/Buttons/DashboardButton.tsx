"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { LuLoader } from "react-icons/lu";

export default function ProfileButton() {
  const [loading, setLoading] = useState(false);
  return (
    <Button className="min-w-[120px]" onClick={() => setLoading(true)} asChild>
      {loading ? (
        <LuLoader className="animate-spin" />
      ) : (
        <Link href={"/dashboard"}>Dashboard</Link>
      )}
    </Button>
  );
}
