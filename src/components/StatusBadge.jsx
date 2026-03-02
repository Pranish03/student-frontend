import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";

export const StatusBadge = ({ active }) => {
  return (
    <>
      {active ? (
        <span className="py-0.5 px-2 rounded-full border border-black/10 text-gray-500 text-sm flex items-center gap-1 max-w-min">
          <IoCheckmarkCircle size={14} className="text-green-500" />
          Active
        </span>
      ) : (
        <span className="py-0.5 px-2 rounded-full border border-black/10 text-gray-500 text-sm flex items-center gap-1 max-w-min">
          <IoCloseCircle size={14} className="text-red-600" />
          Deactive
        </span>
      )}
    </>
  );
};
