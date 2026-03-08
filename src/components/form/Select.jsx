import { LuChevronDown } from "react-icons/lu";

export const Select = ({ className = "", errors, children, ...props }) => {
  return (
    <>
      <div className="relative flex items-center">
        <select
          className={` 
        border rounded-[10px] text-base py-1.5 px-2.5 focus:outline-3 
        placeholder:text-zinc-500 text-zinc-900 w-full appearance-none
        ${
          errors
            ? "border-red-600 focus:border-red-600 focus:outline-red-200"
            : "border-zinc-300 focus:border-green-600 focus:outline-green-300"
        }
        ${className}
      `}
          {...props}
        >
          {children}
        </select>

        <LuChevronDown size={20} className="absolute right-2 text-zinc-700" />
      </div>

      {errors && <p className="text-red-600 mt-2">{errors?.message}</p>}
    </>
  );
};
