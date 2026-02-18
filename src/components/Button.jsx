export const Button = ({ children, type = "button", className = "" }) => {
  return (
    <button
      type={type}
      className={`bg-green-600 text-white text-base px-3 py-2 rounded-xl hover:bg-green-600/90 cursor-pointer transition-colors ease-linear ${className}`}
    >
      {children}
    </button>
  );
};
