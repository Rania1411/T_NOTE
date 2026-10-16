import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  LoaderCircle,
  Save,
  Trash2,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/axios";
import { formatDate } from "../lib/utils";

const NoteDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchNote = async () => {
      setLoading(true);
      setNote(null);
      setFetchError(false);

      try {
        const response = await api.get(`/notes/${id}`);

        if (active) setNote(response.data);
      } catch (error) {
        if (!active) return;

        console.error("Error fetching note:", error);
        setFetchError(true);
        toast.error("Could not load this note.");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchNote();

    return () => {
      active = false;
    };
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();

    if (saving || deleting || !note) return;

    const title = note.title?.trim() ?? "";
    const content = note.content?.trim() ?? "";

    if (!title || !content) {
      toast.error("Both title and content are required.");
      return;
    }

    setSaving(true);

    try {
      await api.put(`/notes/${id}`, { title, content });

      toast.success("Changes saved successfully.");
      navigate("/");
    } catch (error) {
      console.error("Error updating note:", error);

      if (error.response?.status === 429) {
        toast.error("Too many requests. Please try again later.");
      } else if (!error.response) {
        toast.error("Unable to connect to the server.");
      } else {
        toast.error(
          error.response?.data?.message || "Could not update this note."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (saving || deleting || !note) return;

    if (
      !window.confirm(
        "Are you sure you want to delete this note? This cannot be undone."
      )
    ) {
      return;
    }

    setDeleting(true);

    try {
      await api.delete(`/notes/${id}`);

      toast.success("Note deleted successfully.");
      navigate("/");
    } catch (error) {
      console.error("Error deleting note:", error);

      if (error.response?.status === 429) {
        toast.error("Too many requests. Please try again later.");
      } else {
        toast.error(
          error.response?.data?.message || "Could not delete this note."
        );
      }
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4">
        <LoaderCircle className="animate-spin text-[#d9ad62]" size={34} />
        <p className="text-sm text-[#8f98a9]" role="status">
          Opening your note...
        </p>
      </main>
    );
  }

  if (fetchError || !note) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
        <h1 className="font-editorial text-3xl">Note unavailable</h1>
        <p className="mt-3 max-w-md text-sm leading-7 text-[#aab2c1]">
          This note may have been deleted, or the server could not retrieve it.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#d9ad62] px-5 py-3 text-sm font-semibold text-[#17120a]"
        >
          <ArrowLeft size={17} />
          Back to collection
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-[#aab2c1] hover:text-[#e4bd79]"
          >
            <ArrowLeft size={17} />
            Back to collection
          </Link>

          <button
            type="button"
            onClick={handleDelete}
            disabled={saving || deleting}
            className="inline-flex items-center gap-2 rounded-xl border border-red-300/15 px-4 py-2.5 text-sm text-red-300 hover:bg-red-300/10 disabled:opacity-50"
          >
            {deleting ? (
              <LoaderCircle className="animate-spin" size={17} />
            ) : (
              <Trash2 size={17} />
            )}
            {deleting ? "Deleting..." : "Delete note"}
          </button>
        </div>

        <section className="luxury-panel overflow-hidden rounded-3xl">
          <div className="border-b border-[#d9ad62]/10 px-6 py-8 sm:px-10">
            <p className="text-xs uppercase tracking-[0.22em] text-[#d9ad62]">
              Your collection / Edit
            </p>

            <h1 className="mt-3 font-editorial text-3xl sm:text-4xl">
              Refine your thoughts.
            </h1>

            {note.createdAt && (
              <p className="mt-4 flex items-center gap-2 text-xs text-[#858fa1]">
                <CalendarDays size={14} />
                Created {formatDate(new Date(note.createdAt))}
              </p>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-7 p-6 sm:p-10">
            <div>
              <label
                htmlFor="edit-title"
                className="mb-3 block text-sm font-semibold"
              >
                Title
              </label>

              <input
                id="edit-title"
                type="text"
                value={note.title ?? ""}
                onChange={(e) =>
                  setNote({ ...note, title: e.target.value })
                }
                required
                maxLength={150}
                disabled={saving || deleting}
                className="w-full rounded-xl border border-[#d9ad62]/15 bg-[#0b1018]/70 px-4 py-4 text-sm outline-none focus:border-[#d9ad62]/60 disabled:opacity-60"
              />
            </div>

            <div>
              <label
                htmlFor="edit-content"
                className="mb-3 block text-sm font-semibold"
              >
                Content
              </label>

              <textarea
                id="edit-content"
                value={note.content ?? ""}
                onChange={(e) =>
                  setNote({ ...note, content: e.target.value })
                }
                required
                disabled={saving || deleting}
                className="min-h-72 w-full resize-y rounded-xl border border-[#d9ad62]/15 bg-[#0b1018]/70 px-4 py-4 text-sm leading-7 outline-none focus:border-[#d9ad62]/60 disabled:opacity-60"
              />
            </div>

            <div className="flex justify-end border-t border-[#d9ad62]/10 pt-6">
              <button
                type="submit"
                disabled={saving || deleting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#e8c17c] to-[#c9994f] px-6 py-3 text-sm font-semibold text-[#17120a] hover:brightness-110 disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <LoaderCircle className="animate-spin" size={18} />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save changes
                  </>
                )}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
};

export default NoteDetailPage;