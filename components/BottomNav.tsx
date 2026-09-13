"use client";

/**
 * Thanh điều hướng dưới cùng, 3 mục, kèm nút tròn gradient nổi ở giữa để mở
 * Trợ lý AI.
 *
 * Làm lại phần nhìn theo bản GPT: thanh nổi lên khỏi đáy màn hình, bo góc,
 * nền mờ nhìn xuyên thấy nội dung phía sau. Trước đây nó là một dải đặc dán
 * sát đáy, nhìn nặng.
 *
 * usePathname() cho biết đang ở trang nào để tô đậm mục tương ứng.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const path = usePathname();
  const dangO = (p: string) => path === p;

  return (
    <nav className="fixed bottom-0 left-1/2 z-20 w-full max-w-[400px] -translate-x-1/2 px-4 pb-4">
      <div className="relative rounded-[22px] border border-line bg-surface/85 shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl">
        {/* Nút tròn gradient nổi lên trên thanh nav */}
        <Link
          href="/chat"
          aria-label="Mở Trợ lý AI"
          className="absolute -top-6 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-[radial-gradient(circle_at_32%_28%,#a9d4ff_0%,#3b82ff_45%,#1e3fae_100%)] shadow-[0_6px_20px_rgba(59,130,255,0.5)] ring-4 ring-bg"
        >
          <span className="h-5 w-5 rounded-full bg-white/85 blur-[1px]" />
        </Link>

        <div className="flex items-center px-2 pb-2.5 pt-2">
          <MucNav href="/home" nhan="Trang chủ" active={dangO("/home")}>
            <path d="M3 10.5 12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
          </MucNav>

          {/* Ô trống chừa chỗ cho nút tròn ở giữa */}
          <div className="flex-1 pt-7">
            <p
              className={`text-center text-[11px] ${
                dangO("/chat") ? "font-semibold text-brand" : "text-muted"
              }`}
            >
              Trợ lý AI
            </p>
          </div>

          <MucNav href="/ho-so" nhan="Hồ sơ" active={dangO("/ho-so")}>
            <circle cx="12" cy="8" r="3.5" />
            <path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6" />
          </MucNav>
        </div>
      </div>
    </nav>
  );
}

function MucNav({
  href,
  nhan,
  active,
  children,
}: {
  href: string;
  nhan: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 ${
        active ? "text-brand" : "text-muted"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </svg>
      <span className={`text-[11px] ${active ? "font-semibold" : ""}`}>
        {nhan}
      </span>
    </Link>
  );
}
