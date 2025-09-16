"use client";

import { cn } from "@/lib/utils";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import * as React from "react";

interface MultiSelectProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
}

export function MultiSelect({ options, selected, onChange }: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((v) => v !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className="relative w-64">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 text-sm border rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <span className="flex flex-wrap gap-1">
          {selected.length > 0 ? (
            selected.map((s) => (
              <span
                key={s}
                className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs"
              >
                {s}
              </span>
            ))
          ) : (
            <span className="text-gray-400">Select options</span>
          )}
        </span>
        <ChevronDownIcon
          className={cn("size-4 transition-transform", open && "rotate-180")}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute mt-1 w-full max-h-60 overflow-auto rounded-md border bg-white shadow-lg z-50">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => toggleOption(option)}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100",
                selected.includes(option) && "bg-gray-200",
              )}
            >
              <CheckIcon
                className={cn(
                  "size-4",
                  !selected.includes(option) && "opacity-0",
                )}
              />
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
