'use client';

import { FOOTER_LINKS } from "@constants";
import { PROJECTS } from "@constants";
import { useThemeStore } from "@stores";
import Image from "next/image";
import { useEffect, useState } from "react";

const MobileMenu = () => {
  const [isCompact, setIsCompact] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { nextColor } = useThemeStore();
  const menuLinks = [
    { name: "Projeler", url: PROJECTS[0]?.url ?? "#" },
    ...FOOTER_LINKS,
  ];

  useEffect(() => {
    const onResize = () => setIsCompact(window.innerWidth <= 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!isCompact) {
      setIsOpen(false);
      return;
    }
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, isCompact]);

  if (!isCompact) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Mobil menuyu ac"
        onClick={() => setIsOpen(true)}
        className="fixed right-7 top-10 z-30 rounded-full px-3 py-2 text-xs text-white"
        style={{ border: "1px solid #fff", backgroundColor: "none" }}
      >
        MENU
      </button>

      <div className={`fixed inset-0 z-40 transition-opacity duration-500 ease-out ${isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}>
        <button
          type="button"
          aria-label="Mobil menuyu kapat"
          onClick={() => setIsOpen(false)}
          className="absolute inset-0 h-full w-full"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.35)" }}
        />

        <div
          className={`absolute left-0 top-0 h-full w-[82%] max-w-[300px] p-6 transition-transform duration-500 ease-out ${isOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          style={{ backgroundColor: "#f85f2cff" }}
        >
          <div className="mb-6 flex items-center justify-between">
            <Image src="/logosvg.svg" alt="logo" width={148} height={34} priority />
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-lg font-bold leading-none text-white"
              aria-label="Menüyü kapat"
            >
              x
            </button>
          </div>

          <nav className="flex flex-col gap-4">
            {menuLinks.map((item) => (
              <a
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="text-base font-black tracking-wide text-white"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </a>
            ))}
          </nav>

          <button
            type="button"
            onClick={nextColor}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-white px-3 py-2 text-xs font-bold text-white"
          >
            <Image src="icons/night-mode.svg" width={16} height={16} alt="Tema" loading="lazy" />
            Aydınlık/Karanlık
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
