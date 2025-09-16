"use client";

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

// Custom input component with calendar icon
interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string;
  onClick?: React.MouseEventHandler<HTMLInputElement>;
  placeholder?: string;
  error?: string;
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ value, onClick, placeholder, error }, ref) => (
    <div className="relative">
      <input
        ref={ref}
        value={value}
        onClick={onClick}
        placeholder={placeholder}
        readOnly
        className={`w-full px-2 py-2 shadow-b-2 shadow-xs shadow-slate-900/20 pr-10 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-3 focus:text-gray-300 focus:border-text-gray-900 cursor-pointer transition-all duration-200 hover:bg-gray-100
        ${
          error
            ? "border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50"
            : ""
        } 
        placeholder-gray-500 text-sm`}
      />
      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
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
  placeholder = "Select your date of birth",
  className = "",
}) => {
  const handleDateChange = (date: Date | null): void => {
    onChange(date?.toISOString().split("T")[0] || "");
  };

  return (
    <div className={`${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-900 mb-2">
          {label} {required && <span className="text-gray-900">*</span>}
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
        customInput={<CustomInput error={error} />}
        placeholderText={placeholder}
        calendarClassName="shadow-xl border-0 rounded-lg bg-white"
        popperClassName="z-50"
        wrapperClassName="w-full"
        dayClassName={(date) => {
          const today = new Date();
          const isToday = date.toDateString() === today.toDateString();
          const isSelected =
            value && date.toDateString() === new Date(value).toDateString();

          return `hover:bg-blue-500 hover:text-white cursor-pointer rounded transition-colors text-sm
            ${isToday ? "bg-blue-100 text-blue-600 font-medium" : ""}
            ${isSelected ? "bg-blue-500 text-white font-medium" : ""}`;
        }}
        monthClassName={() =>
          "hover:bg-blue-100 cursor-pointer rounded p-2 transition-colors text-sm"
        }
        yearClassName={() =>
          "hover:bg-blue-100 cursor-pointer rounded p-2 transition-colors text-sm"
        }
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default DatePicker;
