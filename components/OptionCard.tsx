"use client";

/**
 * Một ô lựa chọn (dùng cho cả radio một-lựa-chọn và chọn-nhiều).
 * Đang chọn thì nền #EAF2FF (bg-brand-soft) + dấu tích bên phải,
 * KHÔNG làm viền dày thêm — đúng quy ước mục 2 của figma-chot.
 */
export default function OptionCard({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={[
        "flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors",
        selected
          ? "border-brand bg-brand-soft text-text"
          : "border-line bg-surface text-text hover:bg-brand-soft/40",
      ].join(" ")}
    >
      <span className="text-[15px] leading-snug">{label}</span>

      {/* Dấu tích chỉ hiện khi đang chọn */}
      {selected && (
        <svg
          viewBox="0 0 20 20"
          className="h-5 w-5 shrink-0 text-brand"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 10.5l4 4 8-9" />
        </svg>
      )}
    </button>
  );
}
