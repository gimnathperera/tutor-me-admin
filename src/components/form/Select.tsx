import React, { useState, useRef, useEffect } from "react";
import { ChevronDownIcon, CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
  value?: string;
  className?: string;
  size?: "sm" | "default";
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Select an option",
  onChange,
  value = "",
  className = "",
  size = "default",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative w-full ${className}`} ref={selectRef}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          `border-gray-300 data-[placeholder]:text-gray-400 [&_svg:not([class*='text-'])]:text-gray-400
          focus-visible:border-brand-300 focus-visible:ring-brand-500/10 aria-invalid:ring-destructive/20
          dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:hover:bg-gray-900/90
          dark:data-[placeholder]:text-white/30 flex w-full items-center justify-between gap-2 rounded-md border bg-white px-3 py-2 text-sm whitespace-nowrap
          text-left font-medium text-gray-800 shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed
          disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8`,
          selectedOption ? "text-gray-800 dark:text-white/90" : "text-gray-400 dark:text-white/30",
        )}
        data-size={size}
        data-placeholder={!selectedOption}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="flex items-center gap-2 line-clamp-1">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDownIcon
          className={cn(
            "size-4 opacity-50 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="absolute top-full left-0 z-50 w-full mt-1">
          <div
            className={`
            bg-white text-gray-800 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2
            relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 shadow-md
            dark:bg-gray-800 dark:border-gray-700 dark:text-white/90
          `}
          >
            <div className="overflow-x-hidden overflow-y-auto p-1 max-h-[300px]">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "focus:bg-gray-100 focus:text-gray-900 dark:focus:bg-gray-700 dark:focus:text-white/90 [&_svg:not([class*='text-'])]:text-gray-400 dark:[&_svg:not([class*='text-'])]:text-white/50",
                    "relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2",
                    "text-sm outline-hidden select-none hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white/90",
                    "transition-colors duration-150 text-left",
                    value === option.value && "bg-gray-100 dark:bg-gray-700",
                  )}
                  type="button"
                >
                  <span className="flex items-center gap-2 flex-1">
                    {option.label}
                  </span>
                  {value === option.value && (
                    <span className="absolute right-2 flex size-3.5 items-center justify-center">
                      <CheckIcon className="size-4" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Select;
