import { ArrowDown, ArrowUp, ArrowUpDown, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DataTable({
  columns,
  data = [],
  emptyMessage = "No records found",
  sortColumn,
  sortDirection,
  onSort,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-start text-sm">
          <thead className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground">
            <tr>
              {columns.map((col, index) => {
                const isSortable = col.sortable && onSort;
                const isCurrentSort = isSortable && sortColumn === col.accessor;

                return (
                  <th key={index} scope="col" className="px-6 py-3.5 text-start">
                    {isSortable ? (
                      <button
                        type="button"
                        onClick={() => onSort(col.accessor)}
                        className={cn(
                          "inline-flex items-center gap-1.5 transition-colors hover:text-foreground",
                          isCurrentSort && "text-foreground font-bold"
                        )}
                      >
                        <span>{col.header}</span>
                        {isCurrentSort ? (
                          sortDirection === "asc" ? (
                            <ArrowUp className="size-3.5" />
                          ) : (
                            <ArrowDown className="size-3.5" />
                          )
                        ) : (
                          <ArrowUpDown className="size-3.5 opacity-50" />
                        )}
                      </button>
                    ) : (
                      <span>{col.header}</span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Inbox className="h-8 w-8 stroke-1" aria-hidden="true" />
                    <p className="text-sm font-medium">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={row.id ?? rowIndex} className="transition-colors hover:bg-muted/30">
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="whitespace-nowrap px-6 py-4 text-foreground">
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
