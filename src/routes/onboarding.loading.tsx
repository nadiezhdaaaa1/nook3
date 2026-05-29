import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Search } from "lucide-react";

export const Route = createFileRoute("/onboarding/loading")({
  component: LoadingMatches,
});

function LoadingMatches() {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => {
      navigate({ to: "/onboarding/preview" });
    }, 4000);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center text-center py-16">
      <div className="h-16 w-16 rounded-pill bg-sage-100 flex items-center justify-center mb-6 animate-pulse">
        <Search className="h-7 w-7 text-sage-700" />
      </div>
      <h1 className="font-display text-3xl lg:text-4xl font-bold text-charcoal-950">
        Finding your matches
      </h1>
      <p className="mt-3 text-charcoal-600">This usually takes a few seconds…</p>
      <ul className="mt-10 space-y-3 text-left max-w-md w-full text-sm text-charcoal-700">
        <li>✓ Searching 100+ listing sources</li>
        <li>⏳ Scanning recent listings in your selected areas</li>
        <li>⏳ Checking building safety records</li>
        <li>⏳ Building your custom alert profile</li>
      </ul>
    </div>
  );
}
