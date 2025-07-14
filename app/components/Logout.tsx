"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";

type Variant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link"
  | null;

export function Logout({
  variant,
  size,
  classes,
}: {
  variant: Variant;
  size: number;
  classes: string;
}) {
  const router = useRouter();

  const handleClick = async () => {
    const res = await axios.post("/api/auth/logout");
    if (res.status === 200) {
      router.refresh();
    }
  };

  return (
    <div>
      <Button
        onClick={handleClick}
        variant={variant}
        className={`flex gap-3 ${classes}`}
      >
        <LogOut size={size || 16} />
        Logout
      </Button>
    </div>
  );
}
