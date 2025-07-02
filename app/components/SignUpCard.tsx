"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FiGithub } from "react-icons/fi";
import { FaGoogle } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
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
import { useForm } from "react-hook-form";
import { useState } from "react";

const SignUpSchema = z
  .object({
    firstName: z
      .string()
      .min(3, "First name should be at least 3 character long")
      .max(50, "First name cannot exceed 50 characters"),
    lastName: z
      .string()
      .min(3, "Last name should be at least 3 character long")
      .max(50, "Last name cannot exceed more than 50 characters"),
    email: z
      .string()
      .email("Invalid email address")
      .max(256, "Email cannot exceed 256 character"),
    password: z
      .string()
      .min(8, "Password should contain atleast 8 characters")
      .max(20, "Password must be less than 20 characters long"),
    confirmPassword: z
      .string()
      .min(8, "Password should contain atleast 8 characters")
      .max(20, "Password must be less than 20 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    //.refine method is used for validating password and confirm password are same
    message: "Passwords don't match",
    path: ["confirmPassword"],
  }); 

export function SignUpCard() {
  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof SignUpSchema>) {
    setIsLoading(true);
    try {
      const { data } = await axios.post("/api/auth/signup", values, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const id = data.id;
      router.push(`/user/${id}/dashboard`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.response.data.message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="my-5">
          {" "}
          <strong>Sign Up</strong>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-primary-foreground max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle> Sign UP</DialogTitle>
          <DialogDescription>
            Enter your details below to create your account
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="my-1">
                  <FormLabel className="">First name</FormLabel>
                  <FormControl>
                    <Input placeholder="First name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="my-1">
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input placeholder="Last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="my-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="my-1">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="my-1">
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Confirm password"
                      {...field}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <Button type="submit" className="w-full mt-3" disabled={isLoading}>
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
