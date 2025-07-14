"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";


import { MoreHorizontal } from "lucide-react";
import DeleteRecords from "./DeleteRecords";
import EditRecords from "./EditRecords";

const ViewRecords = ({ record }: { record: Records }) => {
  
  return (
    <Drawer>
      <DrawerTrigger>
        <MoreHorizontal />
      </DrawerTrigger>
      <DrawerContent className="flex items-center">
        <div className="md:max-w-[400px] w-11/12 flex flex-col items-center h-full ">
          <DrawerHeader>
            <DrawerTitle>Overview</DrawerTitle>
            <DrawerDescription>Record Details</DrawerDescription>
          </DrawerHeader>
          <div className="details flex flex-col gap-1 items-center w-full">
            <div className="flex justify-between px-4 py-2  rounded-md bg-card gap-3 w-11/12 ">
              <p>Date</p>
              <p className="max-w-[65%]">{record.dates.toDateString()}</p>
            </div>
            <div className="flex justify-between px-4 py-2  rounded-md bg-card gap-3 w-11/12">
              <p>Time</p>
              <p className="max-w-[65%]">{record.times}</p>
            </div>
            <div className="flex justify-between px-4 py-2  rounded-md bg-card gap-3 w-11/12">
              <p>Category</p>
              <p className="max-w-[65%]">{record.category}</p>
            </div>
            <div className="flex justify-between px-4 py-2  rounded-md bg-card gap-3 w-11/12">
              <p>Sub Category</p>
              <p className="max-w-[65%]">{record.subcategory}</p>
            </div>
            <div className="flex justify-between px-4 py-2  rounded-md bg-card gap-3 w-11/12">
              <p>Value</p>
              <p className="max-w-[65%]">₹ {record.value}</p>
            </div>
            {record.payer ? (
              <div className="flex justify-between px-4 py-2  rounded-md bg-card gap-3 w-11/12">
                <p>Payee</p>
                <p className="max-w-[65%]">{record.payer}</p>
              </div>
            ) : null}
            {record.note ? (
              <div className="flex justify-between px-4 py-2  rounded-md bg-card gap-3 w-11/12 ">
                <p>Note</p>
                <p className="max-w-[65%]">{record.note}</p>
              </div>
            ) : null}
          </div>
          <DrawerFooter className="flex-row gap-3 justify-center">
            <EditRecords record={record}/>
            <DeleteRecords transid={record.transid}/>
            <DrawerClose className="text-sm rounded-md bg-primary h-10 px-4 py-2 text-primary-foreground hover:bg-primary/90">
              Close
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ViewRecords;
