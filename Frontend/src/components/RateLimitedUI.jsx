import { Link } from "react-router-dom";
import { Clock3, Home, RefreshCw } from "lucide-react";

const RateLimitedUI = () => {
  return (
    <section className="luxury-panel rounded-3xl px-6 py-14 text-center sm:px-10">
      <div className="mx-auto flex size-20 items-center justify-center rounded-2xl border border-[#d9ad62]/20 bg-[#d9ad62]/5 text-[#e4bd79]">
        <Clock3 size={34} />
      </div>

      <p className="mt-7 text-xs uppercase tracking-[0.22em] text-[#d9ad62]">
        A moment of patience
      </p>

      <h2 className="mt-3 font-editorial text-3xl">
        Take a little pause.
      </h2>

      <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#aab2c1]">
        Too many requests have been made in a short period. Please wait before
        trying again.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#e8c17c] to-[#c9994f] px-5 py-3 text-sm font-semibold text-[#17120a] hover:brightness-110"
          onClick={() => window.location.reload()}
        >
          <RefreshCw size={17} />
          Try again
        </button>

        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl border border-[#d9ad62]/20 px-5 py-3 text-sm text-[#e4bd79] hover:bg-[#d9ad62]/5"
        >
          <Home size={17} />
          Back home
        </Link>
      </div>
    </section>
  );
};

export default RateLimitedUI;