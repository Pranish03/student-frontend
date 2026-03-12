export const Heading = ({ className = "", children }) => {
  return (
    <h1 className={`text-3xl font-bold text-zinc-900 ${className}`}>
      {children}
    </h1>
  );
};
