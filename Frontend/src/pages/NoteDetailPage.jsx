import { useEffect, useState } from "react";
import { ArrowLeft, LoaderCircle, Save, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/axios";

const NoteDetailPage = () => {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    const fetchNote = async () => {
      setLoading(true);
      setFetchError(false);
      setNote(null);

      try {
        const response = await api.get(`/notes/${id}`);

        if (active) setNote(response.data);
      } catch (error) {
        if (!active) return;

        console.error("Error fetching note:", error);
        setFetchError(true);

        toast.error(
          error.response?.data?.message || "Failed to fetch the note."
        );
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

    const title = note?.title?.trim() ?? "";
    const content = note?.content?.trim() ?? "";

    if (!title || !content) {
      toast.error("Both title and content are required.");
      return;
    }

    if (saving || deleting) return;

    setSaving(true);

    try {
      const response = await api.put(`/notes/${id}`, {
        title,
        content,
      });

      if (response.data && response.data._id) {
        setNote(response.data);
      } else {
        setNote((previous) => ({ ...previous, title, content }));
      }

      toast.success("Note updated successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error saving note:", error);

      if (error.response?.status === 429) {
        toast.error("Too many requests. Please try again later.");
      } else if (!error.response) {
        toast.error("Unable to connect to the server.");
      } else {
        toast.error(
          error.response?.data?.message || "Failed to update note."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (saving || deleting) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this note? This action cannot be undone."
    );

    if (!confirmed) return;

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
          error.response?.data?.message || "Failed to delete note."
        );
      }
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-base-200">
        <div className="flex flex-col items-center gap-3" role="status">
          <LoaderCircle className="animate-spin text-primary" size={36} />
          <p className="text-sm text-base-content/60">Loading note...</p>
        </div>
      </main>
    );
  }

  if (fetchError || !note) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-base-200 px-4 text-center">
        <h1 className="text-2xl font-bold">Note not found</h1>
        <p className="max-w-md text-base-content/60">
          This note may have been deleted, or the server could not load it.
        </p>
        <Link to="/" className="btn btn-primary">
          <ArrowLeft size={18} />
          Back to Notes
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-base-200">
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link to="/" className="btn btn-ghost">
            <ArrowLeft size={18} />
            Back to Notes
          </Link>

          <button
            type="button"
            onClick={handleDelete}
            className="btn btn-outline btn-error"
            disabled={saving || deleting}
          >
            {deleting ? (
              <LoaderCircle className="animate-spin" size={18} />
            ) : (
              <Trash2 size={18} />
            )}
            {deleting ? "Deleting..." : "Delete Note"}
          </button>
        </div>

        <section className="card border border-base-content/10 bg-base-100 shadow-xl">
          <div className="card-body p-6 sm:p-8">
            <div className="mb-5">
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
                Edit your note
              </p>
              <h1 className="text-2xl font-bold">Note details</h1>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="form-control">
                <label htmlFor="edit-title" className="label">
                  <span className="label-text font-semibold">Title</span>
                </label>
                <input
                  id="edit-title"
                  type="text"
                  className="input input-bordered w-full focus:input-primary"
                  value={note.title ?? ""}
                  onChange={(e) =>
                    setNote({ ...note, title: e.target.value })
                  }
                  required
                  maxLength={150}
                  disabled={saving || deleting}
                />
              </div>

              <div className="form-control">
                <label htmlFor="edit-content" className="label">
                  <span className="label-text font-semibold">Content</span>
                </label>
                <textarea
                  id="edit-content"
                  className="textarea textarea-bordered min-h-56 w-full resize-y leading-relaxed focus:textarea-primary"
                  value={note.content ?? ""}
                  onChange={(e) =>
                    setNote({ ...note, content: e.target.value })
                  }
                  required
                  disabled={saving || deleting}
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving || deleting}
                >
                  {saving ? (
                    <>
                      <LoaderCircle className="animate-spin" size={18} />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
};

export default NoteDetailPage;