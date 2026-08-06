import { useState } from "react";

// Hero email capture input — sits left of the hero CTA (matches the design mocks).
export function HeroEmailField({
  value,
  onChange,
  fontStyle,
}: {
  value: string;
  onChange: (v: string) => void;
  fontStyle?: React.CSSProperties;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <>
      <label htmlFor="hero-email" className="sr-only">
        Email address
      </label>
      <input
        id="hero-email"
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="hero-email-input"
        style={{
          ...fontStyle,
          borderColor: focused ? "#CE4F12" : "rgba(36,28,18,0.18)",
        }}
      />
      <style>{`
        .hero-email-input {
          box-sizing: content-box;
          height: 56px;
          width: 100%;
          max-width: 272px;
          padding: 0 18px;
          border-radius: 12px;
          border: 1px solid rgba(0, 0, 0, 0.20);
          background-color: #ffffff;
          font-size: 16px;
          color: #241c12;
          outline: none;
          transition: border-color 0.2s ease;
        }
        .hero-email-input::placeholder { color: rgba(36,28,18,0.45); }
      `}</style>
    </>
  );
}
