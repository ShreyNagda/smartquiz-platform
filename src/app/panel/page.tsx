import {
  Dialog,
  DialogContent,
  DialogPortal,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";

export default function PanelPage() {
  return (
    <div>
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogPortal>
          <DialogContent>DIalog</DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  );
}
