import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "w-full text-black p-2 min-h-16 field-sizing-fixed bg-foreground border focus:outline-accent border-accent rounded-xs",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
