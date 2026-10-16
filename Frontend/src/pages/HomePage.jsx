import { useEffect, useMemo, useState } from "react";
import { Search, Sparkles, RotateCw } from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import NoteCard from "../components/NoteCard";
import NotesNotFound from "../components/NotesNotFound";
import RateLimitedUI from "../components/RateLimitedUI";
import api from "../lib/axios";

const HomePage = () => {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchNotes = async () => {
      try {
        const response = await api.get("/notes");

        if (!active) return;

        if (!Array.isArray(response.data)) {
          throw new Error("The notes API did not return an array.");
        }

        setNotes(response.data);
      } catch (error) {
        if (!active) return;

        console.error("Failed to fetch notes:", error);

        if (error.response?.status === 429) {
          setIsRateLimited(true);
        } else {
          setHasError(true);
          toast.error("We couldn't load your notes.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchNotes();

    return () => {
      active = false;
    };
  }, []);

  const filteredNotes = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return notes;

    return notes.filter(
      (note) =>
        note.title?.toLowerCase().includes(query) ||
        note.content?.toLowerCase().includes(query)
    );
  }, [notes, search]);

  const retryFetch = async () => {
    setLoading(true);
    setHasError(false);
    setIsRateLimited(false);

    try {
      const response = await api.get("/notes");

      if (!Array.isArray(response.data)) {
        throw new Error("Invalid notes response.");
      }

      setNotes(response.data);
    } catch (error) {
      console.error("Failed to fetch notes:", error);

      if (error.response?.status === 429) {
        setIsRateLimited(true);
      } else {
        setHasError(true);
        toast.error("Unable to load notes. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-7xl px-5 pb-16 pt-8 sm:px-8 sm:pt-12">
        <section className="luxury-grid relative mb-12 overflow-hidden rounded-3xl border border-[#d9ad62]/15 bg-gradient-to-br from-[#192333] via-[#111722] to-[#0b1018] px-6 py-10 sm:px-10 sm:py-14 lg:px-14">
          <div className="pointer-events-none absolute -right-16 -top-24 size-80 rounded-full bg-[#d9ad62]/10 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 size-64 rounded-full bg-[#7186ac]/10 blur-[90px]" />

          <div className="relative max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d9ad62]/20 bg-[#d9ad62]/5 px-3 py-1.5 text-xs uppercase tracking-[0.16em] text-[#e4bd79]">
              <Sparkles size={14} />
              Your private collection
            </div>

            <h1 className="font-editorial text-4xl leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Your thoughts,
              <br />
              <span className="italic text-[#e4bd79]">beautifully kept.</span>
            </h1>

            <p className="mt-5 max-w-lg text-sm leading-7 text-[#aab2c1] sm:text-base">
              A quiet space for your ideas, plans, and reflections.
              Keep what matters, all in one place.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span className="text-xs uppercase tracking-[0.14em] text-[#8f98a9]">
                Made for your mind
              </span>
              <span className="h-px w-10 bg-[#d9ad62]/40" />
              <span className="font-editorial italic text-[#d9ad62]">
                Think. Write. Remember.
              </span>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#d9ad62]">
                Your workspace
              </p>

              <h2 className="font-editorial text-3xl sm:text-4xl">
                My collection
              </h2>

              {!loading && !hasError && !isRateLimited && (
                <p className="mt-2 text-sm text-[#8f98a9]">
                  {notes.length} {notes.length === 1 ? "note" : "notes"} saved
                </p>
              )}
            </div>

            <label className="flex w-full items-center gap-3 rounded-xl border border-[#d9ad62]/15 bg-[#111722]/80 px-4 py-3 transition focus-within:border-[#d9ad62]/50 sm:max-w-sm">
              <Search size={18} className="shrink-0 text-[#d9ad62]" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your notes..."
                aria-label="Search notes"
                className="w-full bg-transparent text-sm text-[#f4eee4] outline-none placeholder:text-[#727c8e]"
              />
            </label>
          </div>

          {loading ? (
            <div className="flex min-h-60 flex-col items-center justify-center gap-4">
              <span className="loading loading-spinner loading-lg text-[#d9ad62]" />
              <p className="text-sm text-[#8f98a9]" role="status">
                Opening your collection...
              </p>
            </div>
          ) : isRateLimited ? (
            <RateLimitedUI />
          ) : hasError ? (
            <div className="luxury-panel rounded-2xl px-6 py-12 text-center">
              <h3 className="font-editorial text-2xl">
                Your collection is unavailable
              </h3>
              <p className="mt-3 text-sm text-[#aab2c1]">
                Check your connection and try again.
              </p>
              <button
                type="button"
                onClick={retryFetch}
                className="btn btn-primary mt-6"
              >
                <RotateCw size={17} />
                Try again
              </button>
            </div>
          ) : notes.length === 0 ? (
            <NotesNotFound />
          ) : filteredNotes.length === 0 ? (
            <div className="rounded-2xl border border-[#d9ad62]/15 px-5 py-12 text-center">
              <Search className="mx-auto mb-4 text-[#d9ad62]" size={28} />
              <h3 className="font-editorial text-2xl">No matching notes</h3>
              <p className="mt-2 text-sm text-[#8f98a9]">
                Try another search term.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note._id}
                  note={note}
                  setNotes={setNotes}
                />
              ))}
            </div>
          )}
        </section>

        <footer className="mt-16 border-t border-[#d9ad62]/10 pt-6 text-center">
          <p className="text-xs tracking-wide text-[#727c8e]">
            T_NOTE <span className="px-2 text-[#d9ad62]">✦</span>
            A little space for what matters.
          </p>
        </footer>
      </div>
    </main>
  );
};

export default HomePage;