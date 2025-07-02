"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { FiGithub } from "react-icons/fi";
import { FaGoogle } from "react-icons/fa";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useState } from "react";

const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Incorrect password" }),
});

export function LoginCard() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof LoginSchema>) {
    setIsLoading(true);
    try {
      // debugger;
      const response = await axios.post("/api/auth/login", values, {
        headers: { "Content-Type": "application/json" },
      });
      router.push(`/user/${response.data.userID}/dashboard`);
      // debugger;
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.response.data.message,
      });
      setIsLoading(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <strong>Login</strong>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-background md:w-96">
        <DialogHeader>
          <DialogTitle>Login to your account</DialogTitle>
          <DialogDescription>
            Enter your email and password below to login
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel>Registered Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} className="bg-card"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" {...field} type="password"  className="bg-card"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </Form>
        {/* <div className="flex items-center justify-center space-x-4">
          <hr className="flex-grow border-gray-600" />
          <span className=" text-sm">OR CONTINUE WITH</span>
          <hr className="flex-grow border-gray-600" />
        </div>
        <div className="flex gap-6 items-center p-0">
          <Button
            type="submit"
            className="w-full"
            variant="outline"
            onClick={() => setIsLoading(!isLoading)}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FiGithub />
            )}
            <span className="mx-2">Github</span>
          </Button>
          <Button
            type="submit"
            className="w-full"
            variant="outline"
            onClick={() => setIsLoading(!isLoading)}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FaGoogle />
            )}
            <span className="mx-2">Google</span>
          </Button>
        </div> */}
      </DialogContent>
    </Dialog>
  );
}
