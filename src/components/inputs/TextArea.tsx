import React from "react";
import { IoAlertCircleSharp } from "react-icons/io5";
import clsx from "clsx";

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  className?: string;
}

const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  className,
  ...props
}) => {
  return (
    <div className="flex flex-col relative w-full">
      <label
        htmlFor={props.id}
        className={clsx(label ? "font-semibold mb-2" : "hidden")}
      >
        {label}
      </label>

      <div className="relative">
        <textarea
          {...props}
          className={clsx(
            className,
            "h-[240px] w-full p-3 text-start rounded-[12px] border border-secondary focus:outline-none resize-none",
            error
              ? "border-2 border-red-500 focus:border-red-500 pr-14"
              : "border border-secondary focus:border-2 focus:border-secondary"
          )}
        />

        {error && (
          <IoAlertCircleSharp
            size={24}
            data-testid="error-icon"
            className="absolute right-4 top-7 transform -translate-y-1/2 text-red-500"
          />
        )}
      </div>

      {error && <span className="text-red-500 text-sm mt-2">{error}</span>}
    </div>
  );
};

export default TextArea;
