'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface MobileDrawerProps {
  children: React.ReactNode;
}

export function MobileDrawer({ children }: MobileDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Hamburger button - visible only on mobile */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden p-1.5 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800"
        title="Open research logs"
      >
        <Menu className="w-4 h-4" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-slate-900 border-l border-slate-800 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
          <span className="text-sm font-medium text-slate-300">Dashboard</span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="h-[calc(100%-49px)] overflow-hidden">
          {children}
        </div>
      </div>
    </>
  );
}
