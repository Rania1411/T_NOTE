import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  CalendarDays,
  FileText,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../lib/axios";
import { formatDate } from "../lib/utils";

const NoteCard = ({ note, setNotes }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (deleting) return;

    if (
      !window.confirm(
        `Delete "${note.title}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setDeleting(true);

    try {
      await api.delete(`/notes/${note._id}`);

      setNotes((previous) =>
        previous.filter((item) => item._id !== note._id)
      );

      toast.success("Note removed from your collection.");
    } catch (error) {
      console.error("Error deleting note:", error);

      if (error.response?.status === 429) {
        toast.error("Too many requests. Please try again later.");
      } else if (!error.response) {
        toast.error("Unable to connect to the server.");
      } else {
        toast.error(
          error.response?.data?.message || "Could not delete this note."
        );
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <article className="group relative flex min-h-64 flex-col overflow-hidden rounded-2xl border border-[#d9ad62]/15 bg-gradient-to-br from-[#182130] to-[#10151e] transition-all duration-300 hover:-translate-y-1 hover:border-[#d9ad62]/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.28)]">
      <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-[#d9ad62]/5 blur-3xl transition group-hover:bg-[#d9ad62]/10" />

      <div className="relative flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#d9ad62]/20 bg-[#d9ad62]/5 text-[#d9ad62]">
            <FileText size={19} />
          </span>

          <Link
            to={`/note/${note._id}`}
            aria-label={`Open ${note.title}`}
            className="flex size-9 items-center justify-center rounded-full border border-white/5 text-[#8f98a9] hover:border-[#d9ad62]/30 hover:bg-[#d9ad62]/10 hover:text-[#e4bd79]"
          >
            <ArrowUpRight size={18} />
          </Link>
        </div>

        <h3 className="break-words font-editorial text-xl leading-snug text-[#f4eee4]">
          {note.title}
        </h3>

        <p className="mt-3 flex-1 whitespace-pre-wrap break-words text-sm leading-7 text-[#aab2c1] [overflow-wrap:anywhere] line-clamp-4">
          {note.content}
        </p>

        <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/[0.07] pt-4">
          <div className="flex min-w-0 items-center gap-2 text-xs text-[#858fa1]">
            <CalendarDays size={14} className="shrink-0 text-[#d9ad62]/80" />
            <time dateTime={note.createdAt}>
              {note.createdAt
                ? formatDate(new Date(note.createdAt))
                : "Date unavailable"}
            </time>
          </div>

          <div className="flex items-center gap-1">
            <Link
              to={`/note/${note._id}`}
              className="rounded-lg px-3 py-2 text-xs font-semibold text-[#d9ad62] hover:bg-[#d9ad62]/10"
            >
              Edit
            </Link>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              aria-label={`Delete ${note.title}`}
              title="Delete note"
              className="flex size-9 items-center justify-center rounded-lg text-[#858fa1] hover:bg-red-400/10 hover:text-red-300 disabled:opacity-50"
            >
              {deleting ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                <Trash2 size={16} />
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default NoteCard;