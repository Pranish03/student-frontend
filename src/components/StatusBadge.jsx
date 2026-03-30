import { LuCircleCheck, LuCircleX } from "react-icons/lu";

export const StatusBadge = ({
  active,
  right = "Active",
  wrong = "Deactive",
}) => {
  return (
    <>
      {active ? (
        <span className="py-0.5 px-2 rounded-full border border-green-900/20 text-green-500 bg-green-50 text-sm flex items-center gap-1 max-w-min">
          <LuCircleCheck size={14} className="text-green-500" />
          {right}
        </span>
      ) : (
        <span className="py-0.5 px-2 rounded-full border border-red-800/20 text-red-500 bg-red-500/5 text-sm flex items-center gap-1 max-w-min">
          <LuCircleX size={14} className="text-red-500" />
          {wrong}
        </span>
      )}
    </>
  );
};
