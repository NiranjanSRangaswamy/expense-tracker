import { ModeToggle } from "@/app/components/ModeToggle";
import React from "react";
import StatisticsChart from "@/app/components/StatisticsChart";
import { ScrollArea } from "@/components/ui/scroll-area";

const page = async () => {
  return (
    <section className=" statistics w-full md:h-screen md:overflow-x-hidden">
      <div className="w-11/12 md:w-full mx-auto flex flex-col md:h-full">
        <div className="flex justify-between md:w-11/12 mx-auto h-12 md:h-16 items-center">
          <h1 className="text-xl md:text-2xl">Statistics</h1>
          <div className="hidden md:inline-block md:py-2">
            <ModeToggle />
          </div>
        </div>
        <ScrollArea className="grow h-full m-3 mt-0">
          <StatisticsChart />
        </ScrollArea>
      </div>
    </section>
  );
};

export default page;
