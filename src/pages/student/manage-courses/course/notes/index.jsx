import { useQuery } from "@tanstack/react-query";
import { DateTime } from "luxon";
import {
  LuPaperclip,
  LuInbox,
  LuFileText,
  LuClock,
  LuDownload,
} from "react-icons/lu";
import { ImSpinner8 } from "react-icons/im";
import { axios } from "../../../../../lib/axios";

const fetchNotes = async (courseId) => {
  try {
    const { data } = await axios.get(`/resources/course/${courseId}?type=note`);
    return data;
  } catch (err) {
    if (err.response?.status === 404) return { resources: [] };
    throw err;
  }
};

const NoteCard = ({ note, index }) => {
  return (
    <div
      className="bg-white border border-zinc-200 rounded-[10px] p-4"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
          <LuFileText size={17} className="text-blue-600" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-zinc-900 text-sm leading-snug">
            {note.title}
          </p>

          {note.description && (
            <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
              {note.description}
            </p>
          )}

          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className="text-xs text-zinc-400 flex items-center gap-1">
              <LuClock size={11} />
              {DateTime.fromISO(note.createdAt).toRelative()}
            </span>
          </div>
        </div>

        {note.file && (
          <a
            href={note.file}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors shrink-0"
          >
            <LuDownload size={13} />
            Download
          </a>
        )}
      </div>
    </div>
  );
};

export const Notes = ({ courseId }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["student-notes", courseId],
    queryFn: () => fetchNotes(courseId),
    enabled: !!courseId,
    staleTime: 2 * 60 * 1000,
  });

  const notes = data?.resources ?? [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <ImSpinner8 size={28} className="animate-spin text-green-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-red-500 text-sm">
          Failed to load notes. Please try again.
        </p>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <LuInbox size={52} className="text-zinc-300 mb-3" />
        <p className="text-zinc-500 font-semibold">No notes yet</p>
        <p className="text-zinc-400 text-sm mt-1">
          Your teacher hasn&apos;t uploaded any notes for this course yet
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-zinc-500 font-medium">
          {notes.length} note{notes.length !== 1 ? "s" : ""} available
        </p>
      </div>
      <div className="space-y-3">
        {notes.map((note, i) => (
          <NoteCard key={note._id} note={note} index={i} />
        ))}
      </div>
    </div>
  );
};
