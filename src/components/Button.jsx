export const Button = ({
  className = "",
  variant = "primary",
  children,
  ...props
}) => {
  return (
    <button
      className={`
        px-3 py-1.5 rounded-[10px] text-base cursor-pointer transition-colors ease-linear disabled:opacity-70
        disabled:cursor-not-allowed disabled:hover:opacity-70
        ${variant === "primary" && "font-semibold text-white bg-green-600 hover:bg-green-600/90"}
        ${variant === "secondary" && "font-semibold text-gray-800 bg-white hover:bg-black/5 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.2)]"}
        ${variant === "danger" && "font-semibold text-white bg-red-500 hover:bg-red-500/90"}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};
