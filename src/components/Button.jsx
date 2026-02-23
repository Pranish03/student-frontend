export const Button = ({ children, type = "button", className = "" }) => {
  return (
    <button
      type={type}
      className={`
        bg-green-600 text-white font-semibold text-base px-3 py-[7.5px] rounded-lg 
        hover:bg-green-600/90 cursor-pointer transition-colors ease-linear 
        ${className}
      `}
    >
      {children}
    </button>
  );
};
