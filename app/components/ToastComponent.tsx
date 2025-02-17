"use client";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ToastProps {
  title?: string;
  description: string;
  variant: "destructive";
}

export default function ToastComponent({
  toastData,
}: {
  toastData: ToastProps;
}) {
  const { toast } = useToast();
  const router = useRouter();

  const handleRouting = () => {
    router.push("/");
  };
  useEffect(() => {
    toast({
      duration: 3000,
      title: toastData.title,
      description: toastData.description,
      variant: toastData.variant,
      action: (
        <ToastAction altText="Login again" onClick={handleRouting}>
          Login
        </ToastAction>
      ),
    });
  }, []);
  return <div></div>;
}
