"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { string, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useForm, Controller } from "react-hook-form";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createRef, useEffect, useState } from "react";
import { SelectGroup, SelectLabel } from "@radix-ui/react-select";
import { Label } from "@/components/ui/label";
import { PopoverClose } from "@radix-ui/react-popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FaPray } from "react-icons/fa";
import axios from "axios";

const recordSchema = z.object({
  transType: z.enum(["income", "expense"]),
  category: z.string().min(1, "Select category"),
  subCategory: z.string().min(1, "Select sub category"),
  note: z.string().max(150, "Note must be within 150 character"),
  payer: z.string().max(50, "Note must be within 150 character"),
  dates: z.date(),
  hour: z.number(),
  minute: z.number(),
  value: z
    .number({
      required_error: "Value is required",
      invalid_type_error: "value must be a number",
    })
    .gt(0, { message: "Value must be greater than 0" }),
});

export function AddRecords({
  balance,
  userId,
}: {
  balance: number;
  userId: number;
}) {
  const { toast } = useToast();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const categories: string[] = [
    "Food & Drinks",
    "Shoping",
    "Housing",
    "Transportation",
    "Vehicle",
    "Life & Entertainement",
    "Communication",
    "Financial expenses",
    "Investments",
    "Income",
    "Miscellaneous",
  ];

  const subcategories: { [key: string]: string[] } = {
    "Food & Drinks": [
      "Bar, Cafe",
      "Groceries",
      "Restaurent, fast-food",
      "Delivery",
    ],
    Shoping: [
      "Clothes & Shoes",
      "Medicine, Chemist",
      "Electronics, accessories",
      "Free time",
      "Gift, joy",
      "Health and beauty",
      "Home and garden",
      "Jewels, accessories",
      "Kids",
      "Pets, animals",
      "Stationery, tools",
    ],
    Housing: [
      "Energy, utilities",
      "Maintainance, repairs",
      "Mortgage",
      "Property insurance",
      "Rent",
      "services",
    ],
    Transportation: [
      "Business trips",
      "Long distance",
      "Public transport",
      "Taxi",
    ],
    Vehicle: [
      "Fuel",
      "Leasing",
      "Parking",
      "Rentals",
      "Vehicle insurance",
      "Vehicle maintenance",
    ],
    "Life & Entertainement": [
      "Active sport,fitness",
      "Alcohol, tobacco",
      "Books, audio, subscriptions",
      "Charity, gifts",
      "Culture, sport events",
      "Education, development",
      "Health care, doctor",
      "Hobbies",
      "Holiday, trips, hotels",
      "Life events",
      "Lottery, gambling",
      "TV, Streaming",
      "Wellness, beauty",
    ],
    Communication: [
      "Internet",
      "Phone, cell phone",
      "Postal services",
      "Software, apps, games",
    ],
    "Financial expenses": [
      "Advisory",
      "Charges, Fees",
      "Child Support",
      "Fines",
      "Insurance",
      "Loan, interests",
      "Taxes",
    ],
    Investments: [
      "Collections",
      "Financial investments",
      "Realty",
      "Savings",
      "Vehicles, chattels",
    ],
    Income: [
      "Salary",
      "Child support",
      "Dues & grants",
      "Gifts",
      "Interests, dividends",
      "Lending, renting",
      "Lattery, gambling",
      "Refunds (tax, purchase)",
      "Rental income",
      "Sale",
      "Lend",
    ],
    Miscellaneous: ["Miscellaneous"],
  };

  const form = useForm<z.infer<typeof recordSchema>>({
    resolver: zodResolver(recordSchema),
    defaultValues: {
      transType: "expense",
      category: "",
      subCategory: "",
      note: "",
      payer: "",
      dates: new Date(),
      hour: new Date().getHours(),
      minute: new Date().getMinutes(),
      value: 0,
    },
  });

  const selectedCategory = form.watch("category");

  async function onSubmit(values: z.infer<typeof recordSchema>) {
    setIsLoading(true);
    const date = new Date(values.dates);
    if (values.transType === "expense") {
      values.value *= -1;
    }
    const newBalance = balance + values.value;
    date.setHours(values.hour);
    date.setMinutes(values.minute);
    date.setSeconds(0)
    const data = {
      userId,
      transType: values.transType,
      category: values.category,
      subCategory: values.subCategory,
      date: date.toISOString().split("T")[0],
      time: date.toTimeString().split(" ")[0],
      balance: newBalance,
      value: Math.abs(values.value),
      payer: values.payer,
      note: values.note,
    };
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/add-record`,
        data
      );
      if (res.status == 200) {
        form.reset();
        toast({
          duration: 3000,
          variant: "default",
          description: "Record added successfully",
        });
      } else {
        throw new Error();
      }
    } catch (error:any) {
      toast({
        duration: 3000,
        variant: "destructive",
        description: error.message,
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
        <Button size={"sm"} variant={"ghost"} className="bg-primary">
          <Plus size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-popover">
        <Form {...form}>
          <ScrollArea className="p-3">
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-2 max-h-[75vh] m-1">
                <FormField
                  name="transType"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex justify-evenly bg-card rounded-md"
                        >
                          <FormItem
                            className={cn(
                              "flex-grow text-center cursor-pointer m-1  rounded-sm flex ",
                              field.value === "income" ? "bg-primary" : ""
                            )}
                          >
                            <FormControl>
                              <RadioGroupItem
                                value="income"
                                className="hidden"
                              />
                            </FormControl>
                            <FormLabel className="cursor-pointer h-full w-full justify-center items-center p-3">
                              Income
                            </FormLabel>
                          </FormItem>
                          <FormItem
                            className={cn(
                              "flex-grow text-center cursor-pointer m-1 rounded-sm flex",
                              field.value === "expense" ? "bg-primary" : ""
                            )}
                          >
                            <FormControl>
                              <RadioGroupItem
                                value="expense"
                                className="hidden"
                              />
                            </FormControl>
                            <FormLabel className="cursor-pointer h-full w-full justify-center items-center p-3">
                              Expense
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="value"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          className=" h-20 text-6xl text-right p-2 bg-card"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="category"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        defaultValue={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.setValue("subCategory", "");
                        }}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-card">
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                        </FormControl>
                        <FormMessage />
                        <SelectContent className="bg-differ">
                          <SelectGroup>
                            {categories.map((category, i) => (
                              <SelectItem value={category} key={i}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  name="subCategory"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        value={field.value || ""}
                        onValueChange={field.onChange}
                        disabled={!selectedCategory}
                      >
                        <FormControl>
                          <SelectTrigger
                            disabled={!Boolean(selectedCategory)}
                            className="bg-card"
                          >
                            <SelectValue placeholder="Select Sub category" />
                          </SelectTrigger>
                        </FormControl>
                        <FormMessage />
                        <SelectContent className="bg-differ">
                          <SelectGroup>
                            {selectedCategory
                              ? subcategories[selectedCategory].map(
                                  (subcategory, i) => (
                                    <SelectItem value={subcategory} key={i}>
                                      {subcategory}
                                    </SelectItem>
                                  )
                                )
                              : null}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  name="note"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Description"
                          {...field}
                          className="bg-card"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="payer"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Enter  payee name"
                          {...field}
                          className="bg-card"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="dates"
                  control={form.control}
                  render={({ field }) => {
                    const [open, setOpen] = useState(false);
                    return (
                      <FormItem>
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild className="bg-card">
                            <FormControl>
                              <Button
                                variant={"outline"}
                                onClick={() => setOpen(!open)}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 bg-differ">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(value) => {
                                field.onChange(value);
                                setOpen(false);
                              }}
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    );
                  }}
                />
                <div className="flex gap-2">
                  <FormField
                    name="hour"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <Select
                          value={String(field.value)}
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                        >
                          <FormControl>
                            <SelectTrigger className="bg-card">
                              <SelectValue
                                placeholder={new Date().getHours().toString()}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-differ">
                            {Array.from({ length: 24 }, (_, i) => i).map(
                              (index) => (
                                <SelectItem value={String(index)} key={index}>
                                  {index}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="minute"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <Select
                          name="minute"
                          value={
                            field.value !== undefined ? String(field.value) : ""
                          }
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                        >
                          <SelectTrigger className="bg-card">
                            <SelectValue
                              placeholder={new Date().getHours().toString()}
                              {...field}
                            />
                          </SelectTrigger>
                          <SelectContent className="bg-differ">
                            {Array.from({ length: 60 }, (_, i) => i).map(
                              (index) => (
                                <SelectItem value={String(index)} key={index}>
                                  {index}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait...
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
            </form>
          </ScrollArea>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
