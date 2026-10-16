import { useState } from "react";
import { ArrowLeft, Feather, LoaderCircle, Save } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/axios";

const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanTitle = title.trim();
    const cleanContent = content.trim();

    if (!cleanTitle || !cleanContent) {
      toast.error("Please complete both fields.");
      return;
    }

    if (loading) return;

    setLoading(true);

    try {
      await api.post("/notes", {
        title: cleanTitle,
        content: cleanContent,
      });

      toast.success("Your note has been saved.");
      navigate("/");
    } catch (error) {
      console.error("Error creating note:", error);

      if (error.response?.status === 429) {
        toast.error("Too many requests. Please try again later.");
      } else if (!error.response) {
        toast.error("Unable to connect to the server.");
      } else {
        toast.error(
          error.response?.data?.message || "Could not create your note."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-[#aab2c1] hover:text-[#e4bd79]"
        >
          <ArrowLeft size={17} />
          Back to collection
        </Link>

        <section className="luxury-panel mt-7 overflow-hidden rounded-3xl">
          <div className="border-b border-[#d9ad62]/10 px-6 py-8 sm:px-10 sm:py-10">
            <div className="mb-5 flex size-12 items-center justify-center rounded-xl border border-[#d9ad62]/25 bg-[#d9ad62]/10 text-[#e4bd79]">
              <Feather size={23} />
            </div>

            <p className="text-xs uppercase tracking-[0.22em] text-[#d9ad62]">
              Your personal journal
            </p>

            <h1 className="mt-3 font-editorial text-3xl sm:text-4xl">
              Give your thoughts a place.
            </h1>

            <p className="mt-3 text-sm leading-7 text-[#aab2c1]">
              Start with a title, then let your ideas unfold.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-7 p-6 sm:p-10">
            <div>
              <label
                htmlFor="note-title"
                className="mb-3 block text-sm font-semibold text-[#e7e0d5]"
              >
                Title <span className="text-[#d9ad62]">*</span>
              </label>

              <input
                id="note-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="A thought worth keeping..."
                maxLength={150}
                required
                disabled={loading}
                className="w-full rounded-xl border border-[#d9ad62]/15 bg-[#0b1018]/70 px-4 py-4 text-sm text-[#f4eee4] outline-none transition placeholder:text-[#727c8e] focus:border-[#d9ad62]/60 focus:ring-4 focus:ring-[#d9ad62]/5 disabled:opacity-60"
              />

              <p className="mt-2 text-right text-xs text-[#727c8e]">
                {title.length}/150
              </p>
            </div>

            <div>
              <label
                htmlFor="note-content"
                className="mb-3 block text-sm font-semibold text-[#e7e0d5]"
              >
                Your thoughts <span className="text-[#d9ad62]">*</span>
              </label>

              <textarea
                id="note-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write freely. This space is yours..."
                required
                disabled={loading}
                className="min-h-64 w-full resize-y rounded-xl border border-[#d9ad62]/15 bg-[#0b1018]/70 px-4 py-4 text-sm leading-7 text-[#f4eee4] outline-none transition placeholder:text-[#727c8e] focus:border-[#d9ad62]/60 focus:ring-4 focus:ring-[#d9ad62]/5 disabled:opacity-60 sm:min-h-80"
              />

              <p className="mt-2 text-right text-xs text-[#727c8e]">
                {content.length} characters
              </p>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-[#d9ad62]/10 pt-6 sm:flex-row sm:justify-end">
              <Link
                to="/"
                className="rounded-xl border border-white/10 px-5 py-3 text-center text-sm text-[#c3c7d0] hover:bg-white/5"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#e8c17c] to-[#c9994f] px-6 py-3 text-sm font-semibold text-[#17120a] shadow-[0_8px_25px_rgba(217,173,98,0.12)] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <LoaderCircle className="animate-spin" size={18} />
                    Saving your note...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save note
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        <p className="mt-6 text-center font-editorial text-sm italic text-[#858fa1]">
          “Small thoughts can hold great meaning.”
        </p>
      </div>
    </main>
  );
};

export default CreatePage;