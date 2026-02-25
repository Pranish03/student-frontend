export const NavButton = ({
  children,
  type = "button",
  className = "",
  ...props
}) => {
  return (
    <button
      type={type}
      className={`
        font-medium text-base px-3 py-1.5 rounded-lg transition-colors ease-linear
        cursor-pointer w-full flex items-center hover:bg-green-700/5
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};
