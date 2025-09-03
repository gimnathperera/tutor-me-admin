import { cn } from "@/lib/utils";
import * as React from "react";

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      placeholder = "Enter your message",
      rows = 3,
      className = "",
      disabled = false,
      error = false,
      ...props
    },
    ref,
  ) => {
    const textareaClasses = cn(
      "w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800",
      disabled &&
        "text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
      error &&
        "text-error-800 border-error-500 focus:ring-3 focus:ring-error-500/10 dark:text-error-400 dark:border-error-500",
      !disabled &&
        !error &&
        "bg-transparent text-gray-800 border-gray-300 focus:border-gray-300 focus:ring-3 focus:ring-gray-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-gray-800",
      className,
    );

    return (
      <div className="relative">
        <textarea
          ref={ref}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          className={textareaClasses}
          {...props}
        />
      </div>
    );
  },
);

TextArea.displayName = "TextArea";

export default TextArea;
