"use client";

import React, { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  FilterFn,
  SortingState,
  VisibilityState,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  Column,
  Table as TableType,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  ArrowRightLeft,
  ChevronDownIcon,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  Edit,
  FileDown,
  Layers,
  ListRestart,
  PlusCircleIcon,
  SlidersHorizontalIcon,
  Trash,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { rankItem } from "@tanstack/match-sorter-utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

// Define the props for the DataTable component
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

// Filtracijska funkcija za iskanje
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({
    itemRank,
  });

  return itemRank.passed;
};

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnOrder, setColumnOrder] = React.useState(
    columns.map((column) => column.id as string)
  );
  const [draggingColumnId, setDraggingColumnId] = React.useState<string | null>(
    null
  );
  const [rowSelection, setRowSelection] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  // Uporaba react-table prilagojenega React hooka
  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    // defaultColumn: {
    //   minSize: 30,
    //   size: 100,
    //   maxSize: 800,
    // },
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    globalFilterFn: fuzzyFilter,
    columnResizeMode: "onChange",
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnOrder,
      rowSelection,
      columnVisibility,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  // Funkcija za začetek premikanja stolpca
  const onDragStart =
    (columnId: string, isResizing: boolean) => (event: React.MouseEvent) => {
      if (isResizing) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      setDraggingColumnId(columnId);
    };

  // Funkcija za spust stolpca
  const onDrop = (targetColumnId: string) => () => {
    if (!draggingColumnId) return;

    const fromIndex = columnOrder.indexOf(draggingColumnId);
    const toIndex = columnOrder.indexOf(targetColumnId);
    const newColumnOrder = [...columnOrder];
    newColumnOrder.splice(fromIndex, 1);
    newColumnOrder.splice(toIndex, 0, draggingColumnId);

    setColumnOrder(newColumnOrder);
    setDraggingColumnId(null);
  };

  // Preverjanje ali so izbrane vrstice za spodnji menu
  const selectedRowKeys = Object.keys(rowSelection);
  const areRowsSelected = selectedRowKeys.length > 0;

  // Funkcija za pridobitev besedila za menu
  const getSelectionText = (count: number) => {
    if (count === 1) return "Row selected";

    return "Rows selected";
  };

  // Spremenljivke za velikost stolpcev
  const columnSizeVars = React.useMemo(() => {
    // event?.preventDefault();
    const headers = table.getFlatHeaders();
    const colSizes: { [key: string]: number } = {};
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i]!;
      colSizes[`--header-${header.id}-size`] = header.getSize();
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize();
    }
    return colSizes;
  }, [table]);

  // Funkcija za ponastavitev filtrov
  const resetFilters = () => {
    setGlobalFilter("");
    setColumnFilters([]);
  };

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-2">
          <Input
            placeholder="Filter..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm focus-visible:ring-transparent dark:focus-visible:ring-transparent dark:focus-visible:ring-0"
          />
          <div className="flex gap-4">
            <Button variant="outline" onClick={resetFilters}>
              <ListRestart className="w-4 h-4 mr-2" />
              Reset filters
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger aria-haspopup="false" asChild>
                <Button variant="outline">
                  <ChevronDownIcon className="w-4 h-4 mr-2" />
                  Data
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="rounded-md border">
          <Table
            {...{
              className: "divTable",
              style: {
                ...columnSizeVars,
                width: "100%",
              },
            }}
          >
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  {...{
                    key: headerGroup.id,
                    className: "tr",
                  }}
                  key={headerGroup.id}
                >
                  {headerGroup.headers.map((header, columnIndex) => {
                    const isLastColumn =
                      columnIndex === headerGroup.headers.length - 1;
                    const columnWidth = isLastColumn
                      ? "auto"
                      : `calc(var(--header-${header?.id}-size) * 1.5px)`;

                    return (
                      <TableHead
                        key={header.id}
                        style={{ width: columnWidth }}
                        draggable
                        colSpan={header.colSpan}
                        onDragStart={onDragStart(header.id, false)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={onDrop(header.id)}
                        className={`header relative  ${
                          draggingColumnId === header.id ? "border-2 " : ""
                        }`}
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? "cursor-pointer select-none flex items-start"
                                : "",
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}

                            <div
                              {...{
                                onDoubleClick: () => header.column.resetSize(),
                                onMouseDown: header.getResizeHandler(),
                                onTouchStart: header.getResizeHandler(),
                                className: `resizer ${
                                  header.column.getIsResizing()
                                    ? "isResizing"
                                    : ""
                                }`,
                              }}
                            />
                            {header.column.getCanFilter() ? (
                              <DropdownMenu>
                                <DropdownMenuTrigger
                                  aria-haspopup={false}
                                  asChild
                                  className="my-auto ml-2.5"
                                >
                                  <SlidersHorizontalIcon className="h-4 w-4" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  side="right"
                                  className="w-56"
                                >
                                  <DropdownMenuLabel>
                                    Filter by column
                                  </DropdownMenuLabel>
                                  <DropdownMenuSeparator className="my-2 bg-slate-200" />
                                  <DropdownMenuGroup>
                                    <Filter
                                      column={header.column}
                                      table={table}
                                    />
                                  </DropdownMenuGroup>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            ) : null}
                          </div>
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
                    className="h-[70px]"
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
        </div>
        <div className="flex items-center justify-between space-x-2 py-4 px-2">
          <div>
            <span className="flex items-center gap-1">
              <div>Page</div>
              <strong>
                {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </strong>
            </span>
          </div>
          <div className="space-x-2 flex">
            <Button
              variant="secondary"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronFirst className="mr-2 h-4 w-4" />
              First
            </Button>
            <Button
              variant="outline"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            <Button
              variant="outline"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              Last
              <ChevronLast className="ml-2 h-4 w-4" />
            </Button>
            <Select
              value={table.getState().pagination.pageSize.toString()}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger aria-label="Izberi število vrstic">
                <SelectValue placeholder="Izberi število vrstic" />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={pageSize.toString()}>
                    Show {pageSize} rows
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {areRowsSelected && (
          <TooltipProvider>
            <div className="fixed flex z-40 bottom-[45px] left-1/2 transform -translate-x-1/2 bg-gray-50 shadow-2xl rounded-lg transition animate-in duration-300">
              <div className="font-bold text-2xl text-slate-50 rounded-l-lg flex items-center justify-center w-12 h-12 bg-slate-900">
                {selectedRowKeys.length}
              </div>
              <div className="px-4 flex items-center justify-center border-r">
                {getSelectionText(selectedRowKeys.length)}
              </div>

              <div className="flex items-center justify-center gap-2 mx-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => console.log("Uredi", rowSelection)}
                      disabled={selectedRowKeys.length !== 1}
                    >
                      <Edit className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Uredi podatke</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => console.log("Podvoji", rowSelection)}
                    >
                      <Layers className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Podvoji</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => console.log("Podvoji", rowSelection)}
                    >
                      <FileDown className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Export</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => console.log("Podvoji", rowSelection)}
                    >
                      <ArrowRightLeft className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Premakni</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 focus:bg-red-500 focus:text-white hover:bg-red-500 hover:text-white"
                      onClick={() => setOpen(true)}
                    >
                      <Trash className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Izbriši</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </TooltipProvider>
        )}
      </div>
    </>
  );
}

// Komponenta za filtriranje
function Filter({
  column,
  table,
}: {
  column: Column<any, unknown>;
  table: TableType<any>;
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  const sortedUniqueValues = React.useMemo(
    () =>
      typeof firstValue === "number"
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column, firstValue]
  );

  return typeof firstValue === "number" ? (
    <div>
      <div className="flex space-x-2">
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={(columnFilterValue as [number, number])?.[0] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          placeholder={`Min ${
            column.getFacetedMinMaxValues()?.[0]
              ? `(${column.getFacetedMinMaxValues()?.[0]})`
              : ""
          }`}
          className="w-24 border shadow rounded"
        />
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={(columnFilterValue as [number, number])?.[1] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          placeholder={`Max ${
            column.getFacetedMinMaxValues()?.[1]
              ? `(${column.getFacetedMinMaxValues()?.[1]})`
              : ""
          }`}
          className="w-24 border shadow rounded"
        />
      </div>
      <div className="h-1" />
    </div>
  ) : (
    <>
      <datalist id={column.id + "list"}>
        {sortedUniqueValues.slice(0, 5000).map((value: any) => (
          <option value={value} key={value} />
        ))}
      </datalist>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? "") as string}
        onChange={(value) => column.setFilterValue(value)}
        placeholder={`Filter... (${column.getFacetedUniqueValues().size})`}
        className="w-36 border shadow rounded"
        list={column.id + "list"}
      />
    </>
  );
}

// Komponenta za debounce input polje
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 300,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [debounce, onChange, value]);

  return (
    <Input
      style={{ width: "100%" }}
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
