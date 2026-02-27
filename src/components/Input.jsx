export const Input = ({ className = "", errors, ...props }) => {
  return (
    <input
      className={` 
        border rounded-[10px] text-base py-1.5 px-2.5 focus:outline-3 
        placeholder:text-gray-400
        ${
          errors
            ? "border-red-600 focus:border-red-600 focus:outline-red-200"
            : "border-black/20 focus:border-green-600 focus:outline-green-300"
        }
        ${className}
      `}
      {...props}
    />
  );
};
