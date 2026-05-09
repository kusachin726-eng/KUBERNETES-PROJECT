"use client";

import { useState } from "react";
import Image from "next/image";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[200] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
      {/* Container */}
      <div className="flex items-center justify-between px-[60px] py-[12px] max-md:px-[20px]">
        {/* Logo */}
       <Image
                 src="/images/droptylogo.png"
                 alt="Dropty Logo"
                 width={160}
                 height={40}
               />

        {/* Desktop Links */}
        <ul className="hidden md:flex gap-[40px] list-none">
          {[
            { label: "Home", id: "home" },
            { label: "About", id: "about" },
            { label: "Services", id: "services" },
            { label: "How It Works", id: "working" },
            { label: "Contact", id: "contact" },
          ].map((item, i) => (
            <li
              key={i}
              onClick={() => handleScroll(item.id)}
              className="relative cursor-pointer text-[16px] text-[#555] hover:text-[#003DF6]
                         after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0
                         after:bg-[#003DF6] after:transition-all hover:after:w-full"
            >
              {item.label}
            </li>
          ))}
        </ul>

        {/* Hamburger */}
        <div
          onClick={() => setMenuOpen(!menuOpen)}
          className="z-[300] flex flex-col gap-[5px] cursor-pointer md:hidden"
        >
          <span
            className={`w-[25px] h-[3px] bg-[#333] rounded transition-all ${
              menuOpen ? "rotate-45 translate-y-[8px]" : ""
            }`}
          />
          <span
            className={`w-[25px] h-[3px] bg-[#333] rounded transition-all ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`w-[25px] h-[3px] bg-[#333] rounded transition-all ${
              menuOpen ? "-rotate-45 -translate-y-[8px]" : ""
            }`}
          />
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`absolute right-[20px] top-[70px] z-[250]
          w-[220px] rounded-[12px] bg-white shadow-[0_10px_25px_rgba(0,0,0,0.15)]
          transition-all duration-300
          ${
            menuOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-[10px] pointer-events-none"
          }
          md:hidden`}
      >
        <ul className="py-[20px] text-center">
          {[
            { label: "Home", id: "home" },
            { label: "About", id: "about" },
            { label: "Services", id: "services" },
            { label: "How It Works", id: "working" },
            { label: "Contact", id: "contact" },
          ].map((item, i) => (
            <li
              key={i}
              onClick={() => handleScroll(item.id)}
              className="py-[12px] text-[18px] cursor-pointer text-[#333]
                         hover:text-[#003DF6] hover:bg-[#f9f9f9]"
            >
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
