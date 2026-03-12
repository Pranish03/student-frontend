export const Container = ({ className = "", children }) => {
  return (
    <div className={`px-4 sm:px-6 lg:px-8 py-8 ${className}`}>{children}</div>
  );
};
