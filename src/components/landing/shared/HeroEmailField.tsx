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
          borderColor: focused ? "#a05712" : "rgba(36,28,18,0.18)",
        }}
      />
      <style>{`
        .hero-email-input {
          height: 56px;
          width: 100%;
          max-width: 336px;
          padding: 0 18px;
          border-radius: 12px;
          border-width: 1.5px;
          border-style: solid;
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
