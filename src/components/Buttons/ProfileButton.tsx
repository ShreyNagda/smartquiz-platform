"use client";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

export default function ProfileButton() {
  return (
    <Button className="min-w-[120px]">
      <Link href={"/dashboard"}>Dashboard</Link>
    </Button>
  );
}
