"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { DialogOverlay } from "@/components/ui/dialog";
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
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

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
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .gt(0, { message: "Amount must be greater than 0" }),
});

const EditRecords = ({ record }: { record: Records }) => {
  const router = useRouter();

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
      "Furniture",
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

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof recordSchema>>({
    resolver: zodResolver(recordSchema),
    defaultValues: {
      transType: record.transtype,
      category: record.category,
      subCategory: record.subcategory,
      note: record.note,
      payer: record.payer,
      dates: record.dates,
      hour: Number(record.times.split(":")[0]),
      minute: Number(record.times.split(":")[1]),
      value: record.value,
    },
  });

  async function onSubmit(values: z.infer<typeof recordSchema>) {
    setIsLoading(true);
    const date = new Date(values.dates);
    date.setHours(values.hour);
    date.setMinutes(values.minute);
    date.setSeconds(0);
    const data: RecordFormData = {
      transid: record.transid,
      userId: record.userid,
      transType: values.transType,
      category: values.category,
      subCategory: values.subCategory,
      date: date.toISOString().split("T")[0],
      time: date.toTimeString().split(" ")[0],
      value: Math.abs(values.value),
      payer: values.payer,
      note: values.note,
    };
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/edit-record`,
        data
      );
      console.log("res");
      if (res.status == 200) {
        form.reset();
        toast({
          duration: 1000,
          variant: "default",
          description: "Record updated successfully",
        });
      } else {
        throw new Error();
      }
    } catch (error: any) {
      toast({
        duration: 3000,
        variant: "destructive",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  }

  const selectedCategory = form.watch("category");

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="text-sm rounded-md bg-primary h-10 px-4 py-2 text-primary-foreground hover:bg-primary/90">
        Edit Record
      </DialogTrigger>
      <DialogPrimitive.Portal>
        <DialogOverlay>
          <DialogPrimitive.Content
            className="fixed left-[50%] top-[50%] z-50 grid w-4/5 max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-lg"
          >
            <DialogHeader>
              <DialogTitle>Edit Record</DialogTitle>
              <DialogDescription>
                You are currently editing a record
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <ScrollArea className="p-3">
                  <div className="flex flex-col gap-2 max-h-[75vh] m-1">
                    <FormField
                      name="transType"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="flex justify-between items-center ">
                          <FormLabel>Type</FormLabel>
                          <Select
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                          >
                            <div className="flex flex-col gap-2 w-1/2">
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Transaction Type" />
                                </SelectTrigger>
                              </FormControl>
                              <FormMessage />
                            </div>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="income">Income</SelectItem>
                                <SelectItem value="expense">Expense</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="value"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="flex justify-between items-center">
                          <FormLabel>Amount</FormLabel>
                          <div className="flex flex-col gap-2 w-1/2">
                            <FormControl className="">
                              <Input
                                type="number"
                                className=" text-right p-2 bg-card"
                                {...field}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  // Allow empty string, but convert to number if there's input
                                  field.onChange(val === "" ? "" : Number(val));
                                }}
                                value={field.value === 0 ? "" : field.value}
                                placeholder="0"
                              />
                            </FormControl>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="category"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="flex justify-between items-center">
                          <FormLabel>Category</FormLabel>
                          <Select
                            defaultValue={field.value}
                            onValueChange={(value) => {
                              field.onChange(value);
                              form.setValue("subCategory", "");
                            }}
                          >
                            <div className="flex flex-col gap-2 w-1/2">
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                              </FormControl>
                              <FormMessage />
                            </div>
                            <SelectContent>
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
                        <FormItem className="flex justify-between items-center">
                          <FormLabel>Sub Category</FormLabel>
                          <Select
                            value={field.value || ""}
                            onValueChange={field.onChange}
                            disabled={!selectedCategory}
                          >
                            <div className="flex flex-col gap-2 w-1/2">
                              <FormControl>
                                <SelectTrigger
                                  disabled={!Boolean(selectedCategory)}
                                >
                                  <SelectValue placeholder="Select Sub category" />
                                </SelectTrigger>
                              </FormControl>
                              <FormMessage />
                            </div>
                            <SelectContent>
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
                        <FormItem className="flex justify-between items-center">
                          <FormLabel>Note</FormLabel>
                          <div className="flex flex-col gap-2 w-1/2">
                            <FormControl>
                              <Textarea placeholder="Description" {...field} />
                            </FormControl>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="payer"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="flex justify-between items-center">
                          <FormLabel>Payee / Payer</FormLabel>
                          <div className="flex flex-col gap-2 w-1/2">
                            <FormControl>
                              <Input
                                placeholder="Enter  payee name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="dates"
                      control={form.control}
                      render={({ field }) => {
                        return (
                          <FormItem className="flex justify-between items-center">
                            <FormLabel>Date</FormLabel>
                            <Popover
                              open={open}
                              onOpenChange={setOpen}
                              modal={true}
                            >
                              <PopoverTrigger asChild className="w-1/2">
                                <FormControl className="w-1/2">
                                  <Button
                                    variant={"outline"}
                                    onClick={() => setOpen(!open)}
                                    className={cn(
                                      "w-1/2 justify-start text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {format(field.value, "PPP")}
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                onOpenAutoFocus={(e) => e.preventDefault()}
                              >
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
                    <div className="time flex justify-between items-center">
                      <p>Time</p>
                      <div className="flex w-1/2">
                        <FormField
                          name="hour"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem className="flex justify-between items-center flex-grow">
                              <Select
                                value={String(field.value)}
                                onValueChange={(value) =>
                                  field.onChange(Number(value))
                                }
                              >
                                <FormControl className="">
                                  <SelectTrigger>
                                    <SelectValue
                                    {...field}
                                    />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Array.from({ length: 24 }, (_, i) => i).map(
                                    (index) => (
                                      <SelectItem
                                        value={String(index)}
                                        key={index}
                                      >
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
                            <FormItem className="flex justify-between items-center flex-grow">
                              <Select
                                name="minute"
                                value={
                                  field.value !== undefined
                                    ? String(field.value)
                                    : ""
                                }
                                onValueChange={(value) =>
                                  field.onChange(Number(value))
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue
                                    {...field}
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {Array.from({ length: 60 }, (_, i) => i).map(
                                    (index) => (
                                      <SelectItem
                                        value={String(index)}
                                        key={index}
                                      >
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
                    </div>
                  </div>
                </ScrollArea>
                <DialogFooter>
                  <Button type="submit" >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Please wait...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </Button>
                  <DialogClose>Cancel</DialogClose>
                </DialogFooter>
              </form>
            </Form>
          </DialogPrimitive.Content>
        </DialogOverlay>
      </DialogPrimitive.Portal>
    </Dialog>
  );
};

export default EditRecords;
