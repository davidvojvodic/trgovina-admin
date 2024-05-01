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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useDebounce } from "@/hooks/use-debounce";

// Define the props for the DataTable component
interface DataTableProps<TData, TValue> {

