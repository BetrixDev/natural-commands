import { Link } from "@tanstack/react-router";
import { BotMessageSquareIcon, Menu, X } from "lucide-react";
import { useState } from "react";
import { Container } from "./container";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-gray-900/90 shadow-md backdrop-blur-sm transition-colors duration-300">
      <Container>
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-2">
            <BotMessageSquareIcon className="h-8 w-8 text-emerald-400" />
            <span className="font-bold text-xl">Natural Commands</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-8 md:flex">
            <a
              href="#benefits"
              className="transition-colors hover:text-emerald-400"
            >
              Benefits
            </a>
            <a
              href="#examples"
              className="transition-colors hover:text-emerald-400"
            >
              Examples
            </a>
            <a
              href="#compatibility"
              className="transition-colors hover:text-emerald-400"
            >
              Compatibility
            </a>
            <a
              href="#download"
              className="rounded-md bg-emerald-500 px-4 py-2 transition-colors hover:bg-emerald-600"
            >
              Download
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="text-gray-100 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="flex flex-col space-y-4 border-gray-700 border-t py-4 md:hidden">
            <Link
              to="/"
              className="transition-colors hover:text-emerald-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              Benefits
            </Link>
            <Link
              to="/"
              className="transition-colors hover:text-emerald-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              Examples
            </Link>
            <Link
              to="/"
              className="transition-colors hover:text-emerald-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              Compatibility
            </Link>
            <Link
              to="/"
              className="inline-block w-full rounded-md bg-emerald-500 px-4 py-2 text-center transition-colors hover:bg-emerald-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Download
            </Link>
          </nav>
        )}
      </Container>
    </header>
  );
};
