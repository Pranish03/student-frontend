export const Input = ({ className = "", errors, ...props }) => {
  return (
    <input
      className={` 
        ${className}
        ${errors ? "border-red-600" : "border-black/20"}
        border rounded-xl text-lg py-1.5 px-2.5 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600 placeholder:text-gray-400
      `}
      {...props}
    />
  );
};
