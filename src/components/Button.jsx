export const Button = ({
  children,
  type = "button",
  className = "",
  loading = false,
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={loading}
      className={`
        px-3 py-1.5 rounded-lg text-base transition-colors ease-linear bg-green-600 text-white font-semibold
        ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-green-600/90 cursor-pointer"}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};
