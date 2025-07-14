"use client";

import React, {
  useMemo,
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
} from "react";
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
  FilterFn,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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
import { ScrollArea } from "@/components/ui/scroll-area"; // Renamed ref to tableScrollAreaRef
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
import Filter from "./Filter";
import { Card } from "@/components/ui/card";



const includesSome: FilterFn<Records> = (
  row,
  columnId,
  filterValue: string[]
) => {
  if (!filterValue || filterValue.length === 0) return true;
  const cellValue = row.getValue(columnId) as string; 
  return filterValue.includes(cellValue);
};

function processData(
  records: Records[],
  startDate: Date,
  endDate: Date
): Records[] {
  const normalizedStartDate = new Date(startDate);
  normalizedStartDate.setHours(0, 0, 0, 0);

  const normalizedEndDate = new Date(endDate);
  normalizedEndDate.setHours(23, 59, 59, 999); 

  if (normalizedStartDate.getTime() > normalizedEndDate.getTime()) {
    return [];
  }

  return records
    .map((record) => {
      const recordDateWithTime = new Date(record.dates); 

      const timeParts = String(record.times).split(":").map(Number);
      if (timeParts.length === 3) {
        recordDateWithTime.setHours(
          timeParts[0],
          timeParts[1],
          timeParts[2],
          0
        );
      } else {
        recordDateWithTime.setHours(0, 0, 0, 0); 
      }

      return { ...record, dates: recordDateWithTime };
    })
    .filter((record) => {
      const recordTimestamp = record.dates.getTime();
      return (
        recordTimestamp >= normalizedStartDate.getTime() &&
        recordTimestamp <= normalizedEndDate.getTime()
      );
    });
}

export function DataTable({ records }: { records: Records[] }) {
  const tableScrollAreaRef = useRef<HTMLDivElement | null>(null); 
  const headerRowRef = useRef<HTMLTableRowElement | null>(null); 
  const firstDataRowRef = useRef<HTMLTableRowElement | null>(null); 

  const isMediumOrLarger = useMediaQuery("(min-width: 768px)");

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 }); 
  const [startDate, setStartDate] = useState<Date>(
    records.length ? records[records.length - 1].dates : new Date()
  );
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
      setColumnVisibility({}); 
    } else {
      setColumnVisibility({
        category: false,
        times: false,
        subcategory: false,
      });
    }
  }, [isMediumOrLarger]);

  useLayoutEffect(() => {
    const calculateAndSetPageSize = () => {
      const scrollAreaElement = tableScrollAreaRef.current;
      const headerElement = headerRowRef.current;
      const firstRowElement = firstDataRowRef.current;

      if (!scrollAreaElement || !headerElement || !firstRowElement) {
        return;
      }

      const measuredHeaderHeight = headerElement.clientHeight; 
      const measuredRowHeight = firstRowElement.clientHeight; 

      if (measuredRowHeight === 0) {
        return;
      }

      const availableHeightForDataRows =
        scrollAreaElement.clientHeight - measuredHeaderHeight;

      const calculatedRowsPerPage = Math.floor(
        availableHeightForDataRows / measuredRowHeight
      );

      if (
        calculatedRowsPerPage > 0 &&
        calculatedRowsPerPage !== pagination.pageSize
      ) {
        setPagination((prev) => ({
          ...prev,
          pageSize: calculatedRowsPerPage,
        }));
      } else if (calculatedRowsPerPage === 0 && tableData.length > 0) {
        setPagination((prev) => ({
          ...prev,
          pageSize: 1,
        }));
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(calculateAndSetPageSize);
    });

    if (tableScrollAreaRef.current) {
      resizeObserver.observe(tableScrollAreaRef.current);
    }

    requestAnimationFrame(calculateAndSetPageSize);

    return () => {
      if (tableScrollAreaRef.current) {
        resizeObserver.unobserve(tableScrollAreaRef.current);
      }
    };
  }, [tableScrollAreaRef.current, tableData.length, pagination.pageSize]);


  const table = useReactTable({
    data: tableData,
    columns: [
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
      //dates
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
            {(row.getValue("dates") as Date).toLocaleDateString("en-GB")}
          </div>
        ),
        enableHiding: false,
      },
      //times
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
        filterFn: includesSome, // Added missing filterFn
      },
      //value
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
          const formatted = new Intl.NumberFormat("en-IN", {
            // Changed to en-IN for INR
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
    ],
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
      arrIncludesSome: includesSome,
    },
  });

  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex;

  const maxVisiblePages = 5;
  let pageLinks = [];
  let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(pageCount - 1, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(0, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageLinks.push(
      <PaginationItem key={i}>
        <PaginationLink
          isActive={currentPage === i}
          onClick={() => table.setPageIndex(i)}
        >
          {i + 1}
        </PaginationLink>
      </PaginationItem>
    );
  }

  return (
    <Card className="w-full overflow-hidden flex flex-col px-2 justify-between h-full grow">
      <div className="flex py-4 flex-col gap-2 flex-start md:flex-row md:justify-between ">
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
            <Button variant="outline" className="bg-accent">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-differ">
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

      <ScrollArea
        className="rounded-md grow"
        type="always"
        ref={tableScrollAreaRef}
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} ref={headerRowRef}>
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
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  ref={index === 0 ? firstDataRowRef : null}
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
                  colSpan={table.getAllColumns().length} 
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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

        <Pagination className="flex md:hidden justify-center space-x-1">
          <PaginationContent>
            <PaginationItem>
              <PaginationLink
                onClick={() => table.setPageIndex(0)}
                className={
                  table.getCanPreviousPage()
                    ? ""
                    : "pointer-events-none opacity-50"
                }
              >
                <ChevronsLeft className="h-4 w-4" />
              </PaginationLink>
            </PaginationItem>
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
            <PaginationItem>
              <PaginationLink isActive className="pointer-events-none">
                {table.getState().pagination.pageIndex + 1}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() => table.nextPage()}
                className={
                  table.getCanNextPage() ? "" : "pointer-events-none opacity-50"
                }
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                className={
                  table.getCanNextPage() ? "" : "pointer-events-none opacity-50"
                }
              >
                <ChevronsRight className="h-4 w-4" />
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        <Pagination className="hidden md:flex justify-center">
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
            {pageLinks} 
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
    </Card>
  );
}

