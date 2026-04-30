"use client";

import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";
import React, { forwardRef } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerProps {
  value?: string;
  onChange: (date: string) => void;
  label?: string;
  required?: boolean;
  error?: string;
  placeholder?: string;
  className?: string;
}

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string;
  onClick?: React.MouseEventHandler<HTMLInputElement>;
  placeholder?: string;
  error?: string;
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ value, onClick, placeholder, error }, ref) => (
    <div className="relative">
      <Input
        ref={ref}
        value={value}
        onClick={onClick}
        placeholder={placeholder}
        readOnly
        aria-invalid={!!error}
        className="cursor-pointer pr-10"
      />

      <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-white/40" />
    </div>
  ),
);

CustomInput.displayName = "CustomInput";

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  label,
  required,
  error,
  placeholder = "Select date",
  className = "",
}) => {
  const handleDateChange = (date: Date | null): void => {
    onChange(date?.toISOString().split("T")[0] || "");
  };

  return (
    <div className={className}>
      {label && (
        <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white/90">
          {label}{" "}
          {required && (
            <span className="text-gray-900 dark:text-white/90">*</span>
          )}
        </label>
      )}

      <ReactDatePicker
        selected={value ? new Date(value) : null}
        onChange={handleDateChange}
        dateFormat="dd/MM/yyyy"
        showYearDropdown
        showMonthDropdown
        dropdownMode="select"
        yearDropdownItemNumber={15}
        maxDate={new Date()}
        customInput={<CustomInput error={error} placeholder={placeholder} />}
        wrapperClassName="w-full"
        popperClassName="z-[9999]"
        calendarClassName="
    !rounded-xl !border !border-gray-200 !bg-white !p-3 !text-gray-900 !shadow-xl
    [&_.react-datepicker__header]:!bg-white
    [&_.react-datepicker__header]:!border-gray-200
    [&_.react-datepicker__current-month]:!text-gray-900
    [&_.react-datepicker__day-name]:!text-gray-500
    [&_.react-datepicker__day]:!text-gray-900
    [&_.react-datepicker__day:hover]:!bg-gray-100
    [&_.react-datepicker__day--selected]:!bg-brand-500
    [&_.react-datepicker__day--selected]:!text-white
    [&_.react-datepicker__day--keyboard-selected]:!bg-brand-500
    [&_.react-datepicker__day--keyboard-selected]:!text-white
    [&_.react-datepicker__month-select]:!bg-white
    [&_.react-datepicker__month-select]:!text-gray-900
    [&_.react-datepicker__year-select]:!bg-white
    [&_.react-datepicker__year-select]:!text-gray-900
  "
        dayClassName={(date) => {
          const today = new Date();
          const isToday = date.toDateString() === today.toDateString();
          const isSelected =
            value && date.toDateString() === new Date(value).toDateString();

          return [
            "!mx-0.5 !rounded-md !text-sm !transition-colors",
            isToday ? "!bg-brand-50 !text-brand-600 !font-semibold" : "",
            isSelected ? "!bg-brand-500 !text-white" : "",
          ].join(" ");
        }}
        monthClassName={() =>
          "!rounded-md !p-2 !text-sm !text-gray-900 hover:!bg-gray-100"
        }
        yearClassName={() =>
          "!rounded-md !p-2 !text-sm !text-gray-900 hover:!bg-gray-100"
        }
      />

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default DatePicker;
