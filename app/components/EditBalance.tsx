"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useId, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { PopoverClose } from "@radix-ui/react-popover";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const balanceSchema = z.object({
  newBalance: z.preprocess(
    (val) => Number(val),
    z.number({
      required_error: "New balance is required",
      invalid_type_error: "New balance must be a number",
    })
  ),
});

export default function EditBalance({
  userId,
  balance,
}: {
  userId: number;
  balance: number;
}) {
  const [selected, setSetselected] = useState<string | null>(null);

  const handleClick = (button: string) => {
    setSetselected(button);
  };

  if (selected) {
    return (
      <div>
        {selected === "button1" && (
          <div>
            <EditInitialBalance balance={balance} userId={userId} />
          </div>
        )}
        {selected === "button2" && (
          <div>
            <AdjustByRecord balance={balance} userId={userId} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <button
        className="flex flex-col justify-center items-center bg-card rounded-lg p-2"
        onClick={() => {
          handleClick("button1");
        }}
      >
        <h2>Change the initial balance</h2>
        <p className="text-xs text-center">
          Write the correct balance and wallet will change the initial balance
          on your account. Use this if you haven't tracked for a long time.
        </p>
      </button>
      <button
        className="flex flex-col justify-center items-center bg-card rounded-lg p-2"
        onClick={() => {
          handleClick("button2");
        }}
      >
        <h2>Adjust by record</h2>
        <p className="text-xs text-center">
          Write the correct balanceand wallet will create a correction record
          for it. Use this if you've forgotten to track just a few expenses.
        </p>
      </button>
    </div>
  );
}

export function EditInitialBalance({
  balance,
  userId,
}: {
  balance: number;
  userId: number;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof balanceSchema>>({
    resolver: zodResolver(balanceSchema),
    defaultValues: {
      newBalance: balance,
    },
  });

  async function onSubmit(values: z.infer<typeof balanceSchema>) {
    setIsLoading(true);
    try {
      const difference = values.newBalance - balance;
      const data = { value: difference, userId: userId };
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/edit-init-balance`,
        data
      );
      if (res.status == 200) {
        toast({
          variant: "default",
          description: "Balance edited successfully",
        });
      }
      router.refresh();
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="newBalance"
          render={({ field }) => (
            <FormItem className="my-3">
              <FormLabel>Enter initial balance</FormLabel>
              <FormControl>
                <Input placeholder="new balance" {...field} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <PopoverClose asChild>
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
        </PopoverClose>
      </form>
    </Form>
  );
}

export function AdjustByRecord({
  balance,
  userId,
}: {
  balance: number;
  userId: number;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof balanceSchema>>({
    resolver: zodResolver(balanceSchema),
    defaultValues: {
      newBalance: balance,
    },
  });

  async function onSubmit(values: z.infer<typeof balanceSchema>) {
    setIsLoading(true);
    try {
      const difference = values.newBalance - balance;
      const transType = difference < 0 ? "expense" : "income";
      const currentDate = new Date();
      const date = currentDate.toISOString().split("T")[0];
      const time = currentDate.toTimeString().split(" ")[0];
      const data = {
        userId,
        transType,
        category: "miscellaneous",
        subCategory: "miscellaneous",
        date,
        time,
        balance: values.newBalance,
        value: Math.abs(difference),
      };

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/add-record`,
        data
      );
      if (res.status === 200) {
        toast({
          variant: "default",
          description: "Balance successfully updated",
        });
      }
      router.refresh();
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="newBalance"
          render={({ field }) => (
            <FormItem className="my-3">
              <FormLabel>Enter your new balance</FormLabel>
              <FormControl>
                <Input placeholder="new balance" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <PopoverClose asChild>
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
        </PopoverClose>
      </form>
    </Form>
  );
}
