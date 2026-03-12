export const Paragraph = ({ className = "", children }) => {
  return <p className={`text-base text-zinc-600 ${className}`}>{children}</p>;
};
