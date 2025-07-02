"use client";

import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const PageRefreshToast = () => {
  const { toast } = useToast();
  const router = useRouter();
  const handleRefresh = () => {
    router.refresh();
  };
  useEffect(() => {
    toast({
      title: "Failed to fetch Data",
      description: "If the problem continues, try contacting support",
      variant: "destructive",
      action: (
        <ToastAction altText="refresh button" onClick={handleRefresh}>
          Refresh
        </ToastAction>
      ),
    });
  }, []);
  return <div></div>;
};

export default PageRefreshToast;
