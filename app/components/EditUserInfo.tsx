"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import ToastComponent from "./ToastComponent";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

const userSchema = z.object({
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
});

const EditUserInfo = ({ userDetails }: { userDetails: UserDetails | null }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: userDetails?.firstname,
      lastName: userDetails?.lastname,
      email: userDetails?.email,
    },
  });

  async function onSubmit(values: z.infer<typeof userSchema>) {
    setIsLoading(true);
    try {
      const data = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
      };
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/user-details`,
        data
      );
      if (res.status !== 200) throw new Error("database error");
      toast({
        duration: 3000,
        description: "Data modified successfully",
      });
    } catch (error: any) {
      console.log(error.data)
      toast({
        duration: 3000,
        variant: "destructive",
        description: error.message,
      });
    } finally {
      setIsOpen(false);
      setIsLoading(false);
      router.refresh();
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            You are currently editing your profile
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-1"
          >
            <FormField
              name="firstName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="First Name" {...field} />
                  </FormControl>
                  <FormMessage className="pl-3" />
                </FormItem>
              )}
            />
            <FormField
              name="lastName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>

                  <FormControl>
                    <Input placeholder="Last Name" {...field} />
                  </FormControl>
                  <FormMessage className="pl-3" />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage className="pl-3" />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-3 flex-col gap-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="text-foreground"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
              <DialogClose className="  inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground">
                Cancel
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserInfo;
