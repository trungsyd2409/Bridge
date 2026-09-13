"use client";

/**
 * Bộ chọn giao diện: Theo thiết bị · Sáng · Tối
 * Đặt ở màn Hồ sơ, đúng chỗ bản thiết kế 08 của anh Nguyễn để nó.
 *
 * Cách hoạt động: ghi thuộc tính data-theme lên thẻ <html>, bảng màu trong
 * app/globals.css đọc thuộc tính đó. Lựa chọn lưu vào localStorage để lần sau
 * mở app vẫn đúng.
 *
 * "Theo thiết bị" nghĩa là gỡ data-theme đi và nghe theo cài đặt sáng tối của
 * máy người dùng.
 */

import { useEffect, useState } from "react";

export const KEY_GIAO_DIEN = "bridge_giao_dien";
export type GiaoDien = "thiet_bi" | "sang" | "toi";

const LUA_CHON: { value: GiaoDien; label: string }[] = [
  { value: "thiet_bi", label: "Theo thiết bị" },
  { value: "sang", label: "Sáng" },
  { value: "toi", label: "Tối" },
];

/** Áp giao diện lên thẻ html. Dùng chung với đoạn script trong layout.tsx. */
export function apGiaoDien(gd: GiaoDien) {
  const html = document.documentElement;
  if (gd === "sang") html.setAttribute("data-theme", "light");
  else if (gd === "toi") html.setAttribute("data-theme", "dark");
  else {
    // Theo thiết bị: máy đang để nền sáng thì mới gắn light, còn lại để mặc định tối
    const maySang = window.matchMedia("(prefers-color-scheme: light)").matches;
    if (maySang) html.setAttribute("data-theme", "light");
    else html.removeAttribute("data-theme");
  }
}

export default function ChonGiaoDien() {
  const [gd, setGd] = useState<GiaoDien>("toi");

  useEffect(() => {
    const luu = window.localStorage.getItem(KEY_GIAO_DIEN) as GiaoDien | null;
    if (luu) setGd(luu);
  }, []);

  function doi(moi: GiaoDien) {
    setGd(moi);
    try {
      window.localStorage.setItem(KEY_GIAO_DIEN, moi);
    } catch {
      /* localStorage bị chặn thì vẫn đổi được, chỉ là không nhớ */
    }
    apGiaoDien(moi);
  }

  return (
    <div className="flex rounded-xl bg-bg p-1">
      {LUA_CHON.map((o) => (
        <button
          key={o.value}
          onClick={() => doi(o.value)}
          className={`flex-1 rounded-lg py-2 text-xs font-semibold ${
            gd === o.value ? "bg-brand text-white" : "text-muted"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
