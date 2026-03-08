export const Label = ({
  className = "",
  errors,
  required = false,
  children,
  ...props
}) => {
  return (
    <label
      className={`block max-w-fit text-sm sm:text-base font-medium mb-2 ${errors ? "text-red-600" : "text-zinc-900"} ${className}`}
      {...props}
    >
      {children}
      {required && <span className="text-red-600">*</span>}
    </label>
  );
};
