import { Column } from "@tanstack/react-table";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { FunnelPlus } from "lucide-react";

type Props = {
  column: Column<any, unknown>;
};

export default function Filter({ column }: Props) {
  const selected = (column.getFilterValue() as string[]) ?? [];
  const uniqueValues = Array.from(
    column.getFacetedUniqueValues()?.keys() ?? []
  );

  const toggleValue = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];

    column.setFilterValue(newSelected.length ? newSelected : undefined);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="p-0 m-0">
          <FunnelPlus size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2">
        {uniqueValues.map((value) => (
          <label key={value} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selected.includes(value)}
              onChange={() => toggleValue(value)}
            />
            <span>{value}</span>
          </label>
        ))}
      </PopoverContent>
    </Popover>
  );
}
