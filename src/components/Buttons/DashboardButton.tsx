"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { LuLoaderCircle } from "react-icons/lu";

export default function ProfileButton() {
  const [loading, setLoading] = useState(false);
  return (
    <Button className="min-w-[120px]" onClick={() => setLoading(true)}>
      {loading ? (
        <LuLoaderCircle className="animate-spin" />
      ) : (
        <Link href={"/dashboard"}>Dashboard</Link>
      )}
    </Button>
  );
}
