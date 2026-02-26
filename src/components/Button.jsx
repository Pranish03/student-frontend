export const Button = ({ className = "", children, ...props }) => {
  return (
    <button
      className={`
        px-3 py-1.5 rounded-lg font-semibold text-base text-white bg-green-600 hover:bg-green-600/90 cursor-pointer 
        transition-colors ease-linear disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:opacity-70
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};
