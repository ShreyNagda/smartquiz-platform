"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { FaGoogle } from "react-icons/fa";
import { LuLoaderCircle } from "react-icons/lu";

import { signIn } from "next-auth/react";
export default function LoginButton() {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      className="min-w-[120px]"
      onClick={async () => {
        setLoading(true);
        await signIn("google", { redirectTo: "/dashboard" });
        setLoading(false);
      }}
    >
      {loading ? (
        <>
          <LuLoaderCircle className="animate-spin" />
        </>
      ) : (
        <>
          <FaGoogle /> Sign In
        </>
      )}
    </Button>
  );
}
