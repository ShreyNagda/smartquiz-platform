import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "text-black w-full p-2 field-sizing-fixed bg-foreground border border-black focus:outline-accent rounded-xs",
        className
      )}
      {...props}
    />
  );
}

export { Input };
