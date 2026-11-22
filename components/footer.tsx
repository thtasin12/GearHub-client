import Link from "next/link";
import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react"
import { CurrentYear } from "@/components/current-year"

function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M13.5 21v-8.2h2.8l.4-3.2h-3.2V7.5c0-.9.3-1.5 1.6-1.5h1.7V3.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.3H7.3v3.2h2.8V21h3.4Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M5.2 3a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 0 0 0-4.4ZM3.3 9h3.8v12H3.3V9Zm6.2 0h3.6v1.6h.1a4 4 0 0 1 3.6-2c3.9 0 4.6 2.5 4.6 5.8V21h-3.8v-5.9c0-1.4 0-3.2-2-3.2s-2.3 1.5-2.3 3.1V21H9.5V9Z" />
    </svg>
  );
}

const footerLinks = {
  Explore: [
    { label: "Browse Equipment", href: "/equipment" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Become an Owner", href: "/owner" },
    { label: "Categories", href: "/categories" },
  ],
  Support: [
    { label: "Help Center", href: "/help" },
    { label: "Contact Us", href: "/contact" },
    { label: "Frequently Asked Questions", href: "/faq" },
    { label: "Safety Guidelines", href: "/safety" },
  ],
  Account: [
    { label: "Sign In", href: "/login" },
    { label: "Create Account", href: "/register" },
    { label: "My Bookings", href: "/dashboard/bookings" },
    { label: "My Favorites", href: "/dashboard/favorites" },
  ],
};

export function Footer() {
  return (
    <footer className="mt-24 overflow-hidden bg-[#101e33] text-white">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-6 pb-12 pt-16 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="group inline-flex items-center gap-2"
              aria-label="GearHub home"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ff7a30] text-xl font-extrabold text-white shadow-lg shadow-orange-500/20 transition-transform group-hover:scale-105">
                G
              </div>

              <span className="text-2xl font-extrabold tracking-tight">
                Gear<span className="text-[#ff8a47]">Hub</span>
              </span>
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-7 text-slate-400">
              Find the right equipment for every project. Rent what you need,
              when you need it, and connect with trusted equipment owners
              through GearHub.
            </p>

            {/* Contact Info */}
            <div className="mt-7 space-y-4">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-[#ff8a47]">
                  <Mail size={17} />
                </div>
                <span>Have a question? Visit our contact page</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-300">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-[#ff8a47]">
                  <MapPin size={17} />
                </div>
                <span>Connecting equipment owners and renters</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="mt-7 flex items-center gap-3">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-slate-300 transition-all hover:border-[#ff8a47] hover:bg-[#ff7a30] hover:text-white"
              >
                <FacebookIcon />
              </a>

              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-slate-300 transition-all hover:border-[#ff8a47] hover:bg-[#ff7a30] hover:text-white"
              >
                <InstagramIcon />
              </a>

              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-slate-300 transition-all hover:border-[#ff8a47] hover:bg-[#ff7a30] hover:text-white"
              >
                <LinkedInIcon />
              </a>
            </div>
          </div>

          {/* Footer Link Sections */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="mb-6 text-sm font-bold uppercase tracking-[0.15em] text-white">
                {title}
              </h3>

              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1 text-sm text-slate-400 transition-colors hover:text-[#ff8a47]"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight
                        size={13}
                        className="opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Trust Section */}
        <div className="mt-16 flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/3 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#ff7a30]/10 text-[#ff8a47]">
              <ShieldCheck size={25} />
            </div>

            <div>
              <h4 className="font-semibold text-white">
                Rent with Confidence
              </h4>
              <p className="mt-1 text-sm text-slate-400">
                Explore equipment and manage your rentals with GearHub.
              </p>
            </div>
          </div>

          <Link
            href="/equipment"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ff7a30] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-[#ff8a47] hover:shadow-lg hover:shadow-orange-500/20"
          >
            Explore Equipment
            <ArrowUpRight size={17} />
          </Link>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-5 border-t border-white/10 pt-7 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-slate-500">
            © <CurrentYear /> GearHub. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
            <Link
              href="/privacy"
              className="transition-colors hover:text-[#ff8a47]"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="transition-colors hover:text-[#ff8a47]"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}