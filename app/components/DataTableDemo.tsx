"use client";

import React, { useMemo, useRef, useState } from "react";
import { useEffect } from "react";
import { useMediaQuery } from "@/lib/useMediaQuery";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

import { FilterFn } from "@tanstack/react-table";
import DateFilter from "./DateFilter";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import ViewRecords from "./ViewRecords";
import EditRecords from "./EditRecords";
import Filter from "./Filter";



const includesSome: FilterFn<any> = (row, columnId, filterValue: string[]) => {
  if (!filterValue || filterValue.length === 0) return true; // show all
  const cellValue: string = row.getValue(columnId);
  return filterValue.includes(cellValue);
};

export function DataTableDemo({ records }: { records: Records[] }) {
  const tableRef = useRef<HTMLDivElement | null>(null);
  const isMediumOrLarger = useMediaQuery("(min-width: 768px)");
  const oldestDate: Date = records.length
    ? records[records.length - 1].dates
    : new Date();

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [startDate, setStartDate] = useState<Date>(oldestDate);
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const tableData = useMemo(
    () => processData(records, startDate, endDate),
    [records, startDate, endDate]
  );

  useEffect(() => {
    if (isMediumOrLarger) {
      // Show all columns
      setColumnVisibility({});
    } else {
      // Hide all columns except maybe essential ones
      setColumnVisibility({
        category: false,
        times: false,
        subcategory: false,
      });
    }
  }, [isMediumOrLarger]);

  useEffect(() => {
    const calculatePageSize = () => {
      if (tableRef.current) {
        const availableHeight = tableRef.current.clientHeight;

        // Estimate height per row (~52px row + ~28px padding)
        const rowHeight = 52;
        const headerHeight = 50;
        const reservedHeight = 75; // pagination + padding

        const maxHeight = availableHeight - headerHeight - reservedHeight;
        const rowsPerPage = Math.floor(maxHeight / rowHeight);

        if (rowsPerPage > 0) {
          setPagination((prev) => ({
            ...prev,
            pageSize: rowsPerPage,
          }));
        }
      }
    };

    // Run initially
    calculatePageSize();

    // Re-run on window resize
    window.addEventListener("resize", calculatePageSize);
    return () => window.removeEventListener("resize", calculatePageSize);
  }, []);
  

  const columns: ColumnDef<Records>[] = [
    //transtype
    {
      accessorKey: "transtype",
      header: ({ column }) => (
        <div className="flex items-center gap-2">
          Type
          <Filter column={column} />
        </div>
      ),
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("transtype")}</div>
      ),
      filterFn: includesSome,
    },
    //date
    {
      accessorKey: "dates",
      header: ({ column }) => {
        return (
          <div className="flex items-center gap-2">
            Date
            <Button
              variant="ghost"
              size="sm"
              className="p-0 m-0"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              <ArrowUpDown size={16} />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">
          {
            //@ts-ignore
            row.getValue("dates").toLocaleDateString("en-GB")
          }
        </div>
      ),
      enableHiding: false,
    },
    //time
    {
      accessorKey: "times",
      header: "Time",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("times")}</div>
      ),
    },
    //category
    {
      accessorKey: "category",
      header: ({ column }) => (
        <div className="flex items-center gap-2">
          Category
          <Filter column={column} />
        </div>
      ),
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("category")}</div>
      ),
      filterFn: includesSome,
    },
    //subcategory
    {
      accessorKey: "subcategory",
      header: ({ column }) => (
        <div className="flex items-center gap-2">
          Sub Category
          <Filter column={column} />
        </div>
      ),
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("subcategory")}</div>
      ),
    },
    //amount
    {
      accessorKey: "value",
      header: ({ column }) => {
        return (
          <div className="flex items-center gap-2">
            Amount
            <Button
              variant="ghost"
              size="sm"
              className="p-0 m-0"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              <ArrowUpDown size={16} />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("value"));

        // Format the amount as a INR amount
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "INR",
        }).format(amount);

        return <div className="text-right font-medium">{formatted}</div>;
      },
      enableHiding: false,
    },
    //actions
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const record = row.original;
        return <ViewRecords record={record} />;
      },
    },
  ];

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    filterFns: {
      arrIncludesSome: (row, columnId, filterValue: string[]) => {
        const value = row.getValue(columnId) as string;
        return filterValue.includes(value);
      },
    },
  });

  return (
    <div className="w-full overflow-hidden flex flex-col px-2 justify-between h-full grow">
      <div className="flex  py-4 flex-col gap-2 flex-start md:flex-row md:justify-between ">
        <div className="flex gap-2 items-center">
          <div className="flex flex-col md:flex-row grow md:items-center md:gap-2">
            <h1 className="text-center ">Start Date</h1>
            <DateFilter date={startDate} setDate={setStartDate} />
          </div>
          <div className="flex flex-col md:flex-row grow md:items-center md:gap-2">
            <h1 className="text-center">End Date</h1>
            <DateFilter date={endDate} setDate={setEndDate} />
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ScrollArea className="rounded-md h-full grow" type="always" ref={tableRef} >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="grow"></div>
      </ScrollArea>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 ">
        <div className="text-sm text-muted-foreground md:mx-10">
          Showing records{" "}
          {table.getState().pagination.pageIndex *
            table.getState().pagination.pageSize +
            1}{" "}
          to{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) *
              table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{" "}
          of {table.getFilteredRowModel().rows.length}
        </div>

        <Pagination className="grow-0">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => table.previousPage()}
                className={
                  table.getCanPreviousPage()
                    ? ""
                    : "pointer-events-none opacity-50"
                }
              />
            </PaginationItem>

            {Array.from({ length: table.getPageCount() }).map((_, index) => {
              return (
                <PaginationItem key={index}>
                  <PaginationLink
                    isActive={table.getState().pagination.pageIndex === index}
                    onClick={() => table.setPageIndex(index)}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() => table.nextPage()}
                className={
                  table.getCanNextPage() ? "" : "pointer-events-none opacity-50"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

function processData(
  records: Records[],
  startDate: Date,
  endDate: Date
): Records[] {
  if (startDate > endDate) return [];

  records.forEach((record) => {
    const date = record.dates;
    const [hours, minutes, seconds] = record.times.split(":").map(Number);
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds);
  });

  return records.filter((record) => {
    const recordDateTime = record.dates;
    return recordDateTime >= startDate && recordDateTime <= endDate;
  });
}
