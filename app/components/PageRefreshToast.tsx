"use client";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ToastAction } from "@radix-ui/react-toast";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const PageRefreshToast = ({ id }: { id: number }) => {
  const { toast } = useToast();
  const router = useRouter();
  useEffect(() => {
    toast({
      duration: 3000,
      title: "Failed to fetch Data",
      variant: "destructive",
    });
  }, []);
  return <div></div>;
};

export default PageRefreshToast;
