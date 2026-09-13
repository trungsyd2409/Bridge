"use client";

import type { LuaChon } from "@/lib/onboarding";

/**
 * Dropdown dùng cho bước Visa và bước Ngành nghề.
 * Dùng thẻ <select> gốc của trình duyệt: trên điện thoại nó mở bánh xe chọn quen thuộc,
 * đọc được bằng trình đọc màn hình, và không tốn thời gian tự dựng — đúng tiêu chí Accessibility.
 */
export default function SelectField({
  value,
  onChange,
  options,
  placeholder,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  options: LuaChon[];
  placeholder: string;
  label: string;
}) {
  return (
    <div className="relative">
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={[
          "w-full appearance-none rounded-xl border border-line bg-surface px-4 py-3.5 pr-11 text-[15px]",
          "outline-none focus:border-brand focus:ring-2 focus:ring-brand/20",
          value ? "text-text" : "text-muted",
        ].join(" ")}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value} className="text-text">
            {o.label}
          </option>
        ))}
      </select>

      {/* Mũi tên tự vẽ, vì appearance-none đã bỏ mũi tên mặc định */}
      <svg
        viewBox="0 0 20 20"
        className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M5 7.5l5 5 5-5" />
      </svg>
    </div>
  );
}
