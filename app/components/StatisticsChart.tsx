import React from "react";

import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import ToastComponent from "@/app/components/ToastComponent";
import { query } from "@/lib/db";
import PageRefreshToast from "@/app/components/PageRefreshToast";
import { Interactive } from "./Interactive";
import { RadarExpenseChart } from "./RadarExpenseChart";
import RecentTransaction from "./RecentTransaction";

const StatisticsCharts = async () => {
  let userRecords: Records[] | undefined = undefined;
  let recentTransaction: Records[] | undefined = undefined;
  let balanceData: { dates: string; balance: number }[] = [];
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");
    if (!token) throw new Error("token not present");
    const id = verify(token.value, process.env.JWT_SECRET as string);
    if (!id) throw new Error("Invaid token");
    try {
      userRecords = await query(
        "select * from records where userid = $1 order by dates, times ",
        [id]
      );
      balanceData = await query(
        "(SELECT TO_CHAR(dates, 'YYYY-MM-DD') AS dates, balance  FROM ( SELECT dates, balance,   ROW_NUMBER() OVER (PARTITION BY dates::date ORDER BY times DESC) AS rn FROM records  WHERE userid = $1) t WHERE t.rn = 1 ORDER BY dates)",
        [id]
      );
      recentTransaction = await query(
        "select * from records where userid = $1 order by dates desc, times desc limit 5",
        [id]
      );
    } catch (error: any) {
      console.log(error.message);
      return <PageRefreshToast key={Math.random()}></PageRefreshToast>;
    }
  } catch (error: any) {
    console.log(error.message);
    return (
      <ToastComponent
        toastData={{
          title: error.message,
          description: "Please Login again",
          variant: "destructive",
        }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <Interactive userRecords={userRecords} balanceData={balanceData} />
      <div className="flex flex-col lg:flex-row gap-3 h-auto">
        <RadarExpenseChart userRecords={userRecords} />
        <RecentTransaction records={recentTransaction} />
      </div>
    </div>
  );
};

export default StatisticsCharts;
