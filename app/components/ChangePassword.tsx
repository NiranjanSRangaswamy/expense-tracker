"use client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronRight, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogDescription } from "@radix-ui/react-dialog";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";

const passwordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(8, "Password must be atleaset 8 characters long")
      .max(20, "Password must be less than 20 characters long"),
    newPassword: z
      .string()
      .min(8, "Password must be atleaset 8 characters long")
      .max(20, "Password must be less than 20 characters long"),
    confirmNewPassword: z
      .string()
      .min(8, "Password must be atleaset 8 characters long")
      .max(20, "Password must be less than 20 characters long"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
  });

const ChangePassword = ({ userId }: { userId: number | undefined }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof passwordSchema>) => {
    setIsLoading(true);
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/edit-password`,
        values
      );
      if (res.status == 200) {
        toast({
          duration: 3000,
          description: "Password modified successfully",
        });
      }
      form.reset();
      setIsOpen(false);
    } catch (error) {
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          const message = (axiosError.response.data as { message?: string })
            ?.message;
          if (message === "Wrong password.") {
            form.setError("oldPassword", { message });
          }
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-11/12 mx-auto bg-card">
      <CardHeader>
        <CardTitle>Password</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-between">
        <h1>Change your password</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger>
            <ChevronRight />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
              <DialogDescription>
                You're currently modifying your password
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form className="" onSubmit={form.handleSubmit(onSubmit)}>
                <div className=" flex flex-col gap-1">
                  <FormField
                    name="oldPassword"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Old Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter Your Old Password"
                            {...field}
                            type="password"
                          />
                        </FormControl>
                        <FormMessage className="pl-3" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="newPassword"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            {...field}
                            placeholder="Enter New Password"
                          />
                        </FormControl>
                        <FormMessage className="pl-3" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="confirmNewPassword"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            {...field}
                            placeholder="Confirm Your New Password"
                          />
                        </FormControl>
                        <FormMessage className="pl-3" />
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter className="mt-3 flex-col gap-2">
                  <Button type="submit" className="" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Please wait...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </Button>
                  <DialogClose
                    onClick={() => {
                      form.reset();
                    }}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                  >
                    Cancel
                  </DialogClose>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ChangePassword;
