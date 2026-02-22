"use client";

export default function OrganizersSection() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-20 flex items-center justify-between border-t border-brand-border bg-brand-bg/90 px-4 py-2 backdrop-blur-xl supports-[backdrop-filter]:bg-brand-bg/60">
      <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-widest text-brand-muted select-none">
        <span>&copy; {new Date().getFullYear()} Codal. All rights reserved</span>
      </div>
      
      <div className="flex items-center gap-3 md:gap-4">
        <a 
          href="https://codal.com/privacy-policy" 
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-medium uppercase tracking-widest text-brand-muted hover:text-brand-primary transition-colors"
        >
          Privacy
        </a>
        <a 
          href="https://codal.com" 
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-medium uppercase tracking-widest text-brand-muted hover:text-brand-primary transition-colors"
        >
          Codal.com
        </a>
      </div>
    </footer>
  );
}
