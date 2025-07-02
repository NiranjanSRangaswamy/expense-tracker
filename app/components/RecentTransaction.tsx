import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BanknoteArrowDown, BanknoteArrowUp, Clock } from "lucide-react";
import React from "react";

const RecentTransaction = ({ records }: { records: Records[] }) => {
  return (
    <Card className="flex grow flex-col justify-evenly">
      <CardHeader className="">
        <CardTitle className="text-center ">Recent Transaction</CardTitle>
      </CardHeader>
      {records.length ? (
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead className="text-center">Date</TableHead>
                <TableHead className="text-center">Time</TableHead>
                <TableHead className="text-center">Category</TableHead>
                <TableHead className="text-center">Subcategory</TableHead>
                <TableHead className="text-center">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.transid}>
                  <TableCell className="text-center">
                    {record.transtype === "income" ? (
                      <BanknoteArrowUp color="green" />
                    ) : (
                      <BanknoteArrowDown color="red" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {record.dates.toLocaleDateString("en-GB")}
                  </TableCell>
                  <TableCell className="text-center">{record.times}</TableCell>
                  <TableCell className="text-center">
                    {record.category}
                  </TableCell>
                  <TableCell className="text-center">
                    {record.subcategory}
                  </TableCell>
                  <TableCell className="text-center">
                    ₹ {record.value}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      ) : (
        <CardContent className="text-center">No recent transaction</CardContent>
      )}
    </Card>
  );
};

export default RecentTransaction;
