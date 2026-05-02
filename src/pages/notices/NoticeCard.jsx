import { DateTime } from "luxon";
import { LuPaperclip, LuClock, LuUser } from "react-icons/lu";

const ROLE_BADGE = {
  all: { label: "Everyone", cls: "bg-blue-50 text-blue-600 border-blue-200" },
  student: {
    label: "Students",
    cls: "bg-purple-50 text-purple-600 border-purple-200",
  },
  teacher: {
    label: "Teachers",
    cls: "bg-amber-50 text-amber-600 border-amber-200",
  },
};

export const NoticeCard = ({ notice, actions }) => {
  const badge = ROLE_BADGE[notice.targetRole] ?? ROLE_BADGE.all;

  return (
    <div className="bg-white border border-zinc-200 rounded-[10px] p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-zinc-900 text-base leading-snug flex-1">
          {notice.title}
        </h3>

        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`text-xs font-medium border px-2 py-0.5 rounded-full ${badge.cls}`}
          >
            {badge.label}
          </span>
          {actions}
        </div>
      </div>

      {notice.description && (
        <p className="text-sm text-zinc-600 leading-relaxed line-clamp-3">
          {notice.description}
        </p>
      )}

      {notice.file && (
        <a
          href={notice.file}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-green-600 hover:underline w-fit"
        >
          <LuPaperclip size={14} />
          View attachment
        </a>
      )}

      <div className="flex items-center gap-4 text-xs text-zinc-400 pt-1 border-t border-zinc-100 mt-auto">
        <span className="flex items-center gap-1">
          <LuUser size={12} />
          {notice.postedBy?.name ?? "Unknown"}
        </span>
        <span className="flex items-center gap-1">
          <LuClock size={12} />
          {DateTime.fromISO(notice.createdAt).toRelative()}
        </span>
      </div>
    </div>
  );
};
