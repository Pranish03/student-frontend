import {
  LuCircleAlert,
  LuCircleCheck,
  LuCircleX,
  LuInfo,
} from "react-icons/lu";

export const Alert = ({ className = "", variant, children }) => {
  return (
    <div
      className={` border rounded-[10px] p-3 flex items-center gap-2
        ${variant === "success" && "bg-green-50 border-green-200 text-green-600"} 
        ${variant === "info" && "bg-blue-50 border-blue-200 text-blue-700"}
        ${variant === "warning" && "bg-yellow-50 border-yellow-200 text-yellow-600"}
        ${variant === "danger" && "bg-red-50 border-red-200 text-red-600"}
        ${className}
    `}
    >
      {variant === "success" && <LuCircleCheck size={18} />}
      {variant === "info" && <LuInfo size={18} />}
      {variant === "warning" && <LuCircleAlert size={18} />}
      {variant === "danger" && <LuCircleX size={18} />}
      {children}
    </div>
  );
};
