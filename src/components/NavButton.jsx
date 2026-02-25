export const NavButton = ({
  children,
  type = "button",
  className = "",
  active,
  ...props
}) => {
  return (
    <button
      type={type}
      className={`
        font-medium text-base px-3 py-1.5 rounded-lg transition-colors ease-linear
        cursor-pointer w-full flex items-center
        ${active ? "bg-green-600 text-white" : "hover:bg-green-600/5"}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};
