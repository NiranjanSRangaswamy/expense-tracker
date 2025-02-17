import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import ToastComponent from "@/app/components/ToastComponent";
import BalanceChart from "@/app/components/BalanceChart";
import ExpensePieChart from "@/app/components/ExpensePieChart";
import { query } from "@/lib/db";
import { ModeToggle } from "@/app/components/ModeToggle";
import { Plus, SquarePen } from "lucide-react";
import { MdCallMade as ExpenseIcon } from "react-icons/md";
import { MdCallReceived as IncomeIcon } from "react-icons/md";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import EditBalance from "@/app/components/EditBalance";
import { AddRecords } from "@/app/components/AddRecords";
import { Suspense } from "react";
import PageRefreshToast from "@/app/components/PageRefreshToast";
import { toast } from "@/hooks/use-toast";
type BalanceChartData = { dates: string; balance: number };
interface PieChartData {
  total: number;
  category: string;
  fill: string | undefined;
}

export default async function Dashboard() {
  let userDetails = null;
  let pieChartData: PieChartData[] | undefined = [];
  let balanceChartData: BalanceChartData[] = [];
  let totalIncome = undefined;
  let totalExpense = undefined;
  let thisMonth = undefined;

  const cookieStore = cookies();
  const token = cookieStore.get("token");
  if (!token) {
    return (
      <ToastComponent
        toastData={{
          title: "Login Error",
          description: "Please Login again",
          variant: "destructive",
        }}
      />
    );
  }

  try {
    const varified = verify(
      token?.value as string,
      process.env.JWT_SECRET as string
    );
    try {
      const res = await query(
        "select id,firstname,darkmode,theme,balance,currency from usertable where id = $1",
        [varified]
      );
      userDetails = res[0];
      const today = new Date();
      thisMonth = today.toDateString().split(" ")[1];
      const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      pieChartData = await query(
        "select sum(value) as total, category from records where userid = $1 and transtype = $2 and dates >= $3 group by category order by total desc",
        [userDetails.id, "expense", firstOfMonth]
      );
      balanceChartData = await query(
        "(SELECT TO_CHAR(dates, 'YYYY-MM-DD') AS dates, balance FROM records WHERE userid = $1 AND dates < $2  ORDER BY dates DESC, times DESC LIMIT 1 ) UNION ALL ( SELECT TO_CHAR(dates, 'YYYY-MM-DD') AS dates, balance  FROM ( SELECT dates, balance,   ROW_NUMBER() OVER (PARTITION BY dates::date ORDER BY times DESC) AS rn FROM records  WHERE userid = $1 and dates >= $2) t WHERE t.rn = 1 ORDER BY dates)",
        [userDetails.id, firstOfMonth]
      );
      totalIncome = await query(
        "select sum(value) from records where userid = $1 and transtype = $2 and dates >= $3 ",
        [userDetails.id, "income", firstOfMonth]
      );
      totalExpense = await query(
        "select sum(value) from records where userid = $1 and transtype = $2 and dates >= $3 ",
        [userDetails.id, "expense", firstOfMonth]
      );
    } catch (error: any) {
      console.log(error.message);
      return <PageRefreshToast id={1} />;
    }
  } catch (error: any) {
    console.log(error.message);
    return (
      <ToastComponent
        toastData={{
          title: "Authorization Error",
          description: "Please Login again",
          variant: "destructive",
        }}
      />
    );
  }

  return (
    <section className="dashboard grow w-full md:h-screen overflow-hidden ">
      <div className="w-11/12 md:w-full mx-auto md:h-full flex flex-col">
        <div className="flex justify-between md:w-11/12 mx-auto h-12 md:h-16 items-center">
          <h1 className="text-xl md:text-2xl">Dashboard</h1>
          <div className="hidden md:inline-block md:py-2">
            <ModeToggle />
          </div>
        </div>
        <div className="grid grid-flow-col gap-3 md:px-3 flex-shrink-0 ">
          {userDetails ? (
            <>
              <Card className="flex-grow">
                <CardHeader>
                  <CardDescription className="flex justify-between items-center">
                    Balance
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button size={"sm"} variant={"ghost"} className="p-0">
                          <SquarePen size={16} />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-3">
                        <EditBalance
                          userId={userDetails.id}
                          balance={userDetails.balance}
                        />
                      </PopoverContent>
                    </Popover>
                  </CardDescription>
                  <CardTitle className="">$ {userDetails.balance}</CardTitle>
                </CardHeader>
              </Card>
              <Card className="flex-grow">
                <CardHeader>
                  <CardDescription className="flex justify-between items-center">
                    Income
                    <span className="h-10  py-2 flex justify-center items-center">
                      <IncomeIcon size={16} />
                    </span>
                  </CardDescription>
                  <CardTitle>$ {totalIncome?.[0]?.sum || 0}</CardTitle>
                </CardHeader>
              </Card>
              <Card className="flex-grow">
                <CardHeader>
                  <CardDescription className="flex justify-between items-center">
                    Expense
                    <span className="h-10 py-2 flex justify-center items-center">
                      <ExpenseIcon size={16} />
                    </span>
                  </CardDescription>
                  <CardTitle>$ {totalExpense?.[0]?.sum || 0}</CardTitle>
                </CardHeader>
              </Card>
            </>
          ) : (
            <></>
          )}
        </div>
        <div className="flex flex-col md:h-full flex-grow overflow-hidden md:flex-row justify-between gap-3 md:px-3 py-3">
          {balanceChartData.length ? (
            <>
              <BalanceChart balanceData={balanceChartData} month={thisMonth} />
              <ExpensePieChart pieChartData={pieChartData} />
            </>
          ) : (
            <Card className="flex-grow grid place-content-center">
              <h1 className="w-sc">
                Please add records to view your spending graph
              </h1>
            </Card>
          )}
        </div>
      </div>
      {userDetails ? (
        <div className="fixed right-10 bottom-16 bg-card z-50">
          <AddRecords balance={userDetails.balance} userId={userDetails.id} />
        </div>
      ) : (
        <></>
      )}
    </section>
  );
}
