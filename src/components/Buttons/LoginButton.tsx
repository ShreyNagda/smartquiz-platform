"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { FaGoogle } from "react-icons/fa";
import { LuLoaderCircle } from "react-icons/lu";

import { signIn } from "next-auth/react";
export default function LoginButton({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      className={"min-w-[120px] " + className}
      onClick={async () => {
        setLoading(true);
        await signIn("google", { redirectTo: "/dashboard" });
      }}
    >
      {loading ? (
        <>
          <LuLoaderCircle className="animate-spin" />
        </>
      ) : (
        <>
          {children || (
            <>
              <FaGoogle /> Sign In
            </>
          )}
        </>
      )}
    </Button>
  );
}
