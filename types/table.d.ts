// types/table.d.ts or directly in your table setup file

import { Column } from "@tanstack/react-table";

// Define the props type for the custom filter component
export type DataTableFilterComponentProps<TData extends object = any> = {
  column: Column<TData, unknown>;
};

// Correctly extend ColumnMeta with the required type parameters
declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends object, TValue> {
    filterComponent?: React.FC<DataTableFilterComponentProps<TData>>;
  }
}
