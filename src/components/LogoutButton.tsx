"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";
import { LuLoaderCircle } from "react-icons/lu";
import Cookies from "js-cookie";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      className="min-w-[120px]"
      variant={"destructive"}
      onClick={async () => {
        setLoading(true);
        await signOut({ redirectTo: "/" });
        Cookies.remove("id");
        setLoading(false);
      }}
    >
      {loading ? (
        <>
          <LuLoaderCircle className="animate-spin" />
        </>
      ) : (
        <>Sign Out</>
      )}
    </Button>
  );
}
