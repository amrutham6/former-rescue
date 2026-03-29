import { useState } from "react";
import { Globe, Check } from "lucide-react";

const languages = [
  { code: "en", label: "English", native: "English" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
];

export function LanguageSelector() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("en");

  const current = languages.find((l) => l.code === selected)!;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm font-medium text-foreground transition-colors"
      >
        <Globe className="w-4 h-4 text-muted-foreground" />
        <span>{current.native}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 w-48 bg-card rounded-xl shadow-elevated border border-border py-1 animate-fade-in">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setSelected(lang.code);
                  setOpen(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-muted transition-colors"
              >
                <span className="flex-1 text-left">
                  <span className="font-medium text-foreground">{lang.native}</span>
                  <span className="text-muted-foreground ml-2">{lang.label}</span>
                </span>
                {selected === lang.code && <Check className="w-4 h-4 text-primary" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
