export const Button = ({
  children,
  type = "button",
  className = "",
  loading = false,
}) => {
  return (
    <button
      type={type}
      disabled={loading}
      className={`
        bg-green-600 shadow text-white font-semibold text-base px-3 py-1.5 
        rounded-lg transition-colors ease-linear 
        ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-green-600/90 cursor-pointer"}
        ${className}
      `}
    >
      {children}
    </button>
  );
};
