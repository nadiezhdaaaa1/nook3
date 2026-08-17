import searchIllustration from "@/assets/search-3.png.asset.json";

/**
 * Generic dashboard/app empty state: illustration, display-font title,
 * muted body line(s), centered action. Calm by default — no warning styling.
 */
export function EmptyState({
  title,
  body,
  action,
  showIllustration = true,
}: {
  title: string;
  body: React.ReactNode;
  action?: React.ReactNode;
  showIllustration?: boolean;
}) {
  return (
    <div className="mx-auto flex w-full max-w-[960px] flex-col items-center justify-center p-2">
      <div className="w-full px-6 py-12 text-center">
        {showIllustration && (
          <img
            src={searchIllustration.url}
            alt=""
            aria-hidden
            width={48}
            height={64}
            className="mx-auto mb-4 h-16 w-12"
          />
        )}
        <h3 className="font-display text-[22px] font-semibold text-[#241c12]">{title}</h3>
        <p className="mx-auto mt-2 max-w-[420px] text-[15px] leading-[22px] text-charcoal-600">
          {body}
        </p>
        {action && <div className="mt-6 flex justify-center">{action}</div>}
      </div>
    </div>
  );
}
