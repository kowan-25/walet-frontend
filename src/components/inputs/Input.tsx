import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { IoAlertCircleSharp } from "react-icons/io5";
import clsx from "clsx";
import { FaMagnifyingGlass } from "react-icons/fa6";
import Button from "@/components/buttons/Button";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className, type, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const isSearch = type === "search";

  return (
    <div className="flex flex-col relative w-full">
      <label htmlFor={props.id} 
        className={clsx(label ? "font-semibold mb-2" : "display-none")}>
            {label}
      </label>
      <div className="relative">
        <input
          {...props}
          type={isPassword && showPassword ? "text" : type}
          className={clsx(
            className,
            "p-4 border rounded-2xl focus:outline-none w-full",
            error
              ? "border-2 border-red-500 focus:border-red-500 pr-14"
              : "border border-secondary focus:border-2 focus:border-secondary",
            isPassword
              ? "pr-12"
              : ""
          )}
        />
        
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        )}

        {error && type !== "password" && (
          <IoAlertCircleSharp
            size={24}
            data-testid="error-icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-500"
          />
        )}

        {isSearch && (
          <Button
            type="button"
            onClick={() => {}}
            className="p-0 absolute right-2 h-8 w-8 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-700 rounded-full"
          >
            <FaMagnifyingGlass size={16} className="absolute"/>
          </Button>
        )}
      </div>


      {error && <span className="text-red-500 text-sm mt-2">{error}</span>}
    </div>
  );
};

export default Input;
