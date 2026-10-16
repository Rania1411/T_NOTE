import { Link } from "react-router-dom";
import { ArrowUpRight, NotebookPen, Plus } from "lucide-react";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-30 border-b border-[#d9ad62]/15 bg-[#0b1018]/90 backdrop-blur-xl">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8"
        aria-label="Main navigation"
      >
        <Link to="/" className="group flex items-center gap-3">

          <span>
            <span className="block font-editorial text-2xl tracking-wide text-[#f4eee4]">
              T_NOTE
            </span>
            <span className="hidden text-[10px] uppercase tracking-[0.24em] text-[#d9ad62]/75 sm:block">
              The art of remembering
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="hidden items-center gap-2 text-sm text-[#c3c7d0] transition hover:text-[#e4bd79] sm:flex"
          >
            My collection
            <ArrowUpRight size={15} />
          </Link>

          <Link
            to="/create"
            className="inline-flex items-center gap-2 rounded-xl border border-[#f0ce91]/30 bg-gradient-to-r from-[#e8c17c] to-[#c9994f] px-4 py-2.5 text-sm font-semibold text-[#17120a] shadow-[0_4px_20px_rgba(217,173,98,0.12)] hover:brightness-110"
          >
            <Plus size={17} />
            <span>New note</span>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;