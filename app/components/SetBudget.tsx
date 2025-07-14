"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { FormEvent, useState, useEffect, use } from "react";
import { number, z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Settings } from "lucide-react";
import { useRouter } from "next/navigation";

const budgetSchema = z.object({
  budget: z
    .number({
      required_error: "Field cannot be empty.",
      invalid_type_error: "Only numbers are allowed",
    })
    .gte(0, { message: "Number cannot be negative" }),
});

const SetBudget = ({ budget }: { budget: number | undefined }) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    form.reset({ budget: budget || 0 });
  }, [budget]);

  const form = useForm<z.infer<typeof budgetSchema>>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      budget: budget,
    },
  });

  async function onSubmit(values: z.infer<typeof budgetSchema>) {
    setIsLoading(true);
    const data = {
      budget: values.budget,
    };
    try {
      const res = await axios.post(
        `/api/user/budget`,
        data
      );
      if (res.status == 201) {
        form.reset();
        toast({
          duration: 3000,
          variant: "default",
          description: "Budget set successfully",
        });
      } else {
        throw Error('unknown error');
      }
    } catch (error:any) {
      let errorMessage = error.message;
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data.message;
      }
      toast({
        duration: 3000,
        variant: "destructive",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
      setIsOpen(false);
      router.refresh();
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button size={"sm"} variant={"default"}>
          <Settings size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-3">
        <div className=" rounded-lg ">
          <h1 className="">Set Budget</h1>
          <Form {...form}>
            <form
              className=" flex flex-col gap-2"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                name="budget"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className=" bg-card"
                        type="number"
                        {...field}
                        placeholder={budget ? String(budget) : '0'}
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(val === "" ? 0 : Number(val));
                        }}
                        value={field.value === 0 ? "" : field.value}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SetBudget;
