"use client";

/**
 * Màn Trợ lý AI — đường dẫn "/chat"
 *
 * ĐÂY CHỈ LÀ GIAO DIỆN. Phần gọi AI thật là của anh Trung.
 * ====> CHỖ NỐI API: hàm guiCauHoi() ở dưới, chỗ có comment "NỐI API Ở ĐÂY".
 *       Hiện tại nó trả về câu trả lời mẫu cố định để demo được ngay.
 *
 * Đề bài RMWC ghi hai lần: "AI content about legal rights must be grounded in
 * verified sources and signposted to human help." Nên mỗi câu trả lời của trợ lý
 * đều có sẵn DÒNG NGUỒN và NÚT LIÊN HỆ RMWC ở cuối. Anh Trung chỉ cần truyền
 * thêm trường `nguon` vào là hiện ra.
 */

import { useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { GOI_Y_CHAT } from "@/lib/noi-dung";

type TinNhan = {
  ai: "bot" | "nguoi";
  noiDung: string;
  /** Nguồn dẫn chứng, chỉ có ở câu trả lời của trợ lý */
  nguon?: { ten: string; url: string };
};

const CHAO: TinNhan = {
  ai: "bot",
  noiDung:
    "Chào bạn, mình là trợ lý AI hỗ trợ bạn tìm hiểu quyền lợi làm việc tại Úc. Hôm nay bạn muốn tìm hiểu gì?\n\nBạn có thể gửi tin nhắn, hình ảnh hoặc voice cho tôi",
};

/** Câu trả lời mẫu, dùng khi phần AI của anh Trung chưa nối xong */
const TRA_LOI_MAU: TinNhan = {
  ai: "bot",
  noiDung:
    "Có thể chủ đang nói với bạn một thông tin chưa đúng. Visa du học giới hạn số giờ bạn được phép làm, chứ không quy định bạn chỉ được nhận tối đa bao nhiêu tiền một giờ.\n\n**Bạn có thể làm gì?**\nHãy dùng tính năng Kiểm tra công việc để xem công việc của bạn thực sự phải được trả bao nhiêu.\n\n**Bạn nên giữ lại gì?**\nTin nhắn chủ đưa cho bạn về mức lương, cùng các phiếu lương đã nhận.\n\n**Nếu vẫn không chắc thì sao?**\nLiên hệ RMWC để được kiểm tra lại miễn phí và bảo mật.",
  nguon: {
    ten: "Fair Work Ombudsman — Visa holders & migrants",
    url: "https://www.fairwork.gov.au/find-help-for/visa-holders-migrants",
  },
};

export default function ChatPage() {
  const [tinNhan, setTinNhan] = useState<TinNhan[]>([CHAO]);
  const [dangGo, setDangGo] = useState("");

  function guiCauHoi(noiDung: string) {
    if (!noiDung.trim()) return;
    setTinNhan((cu) => [...cu, { ai: "nguoi", noiDung }]);
    setDangGo("");

    // ============ NỐI API Ở ĐÂY ============
    // Anh Trung thay đoạn setTimeout này bằng lời gọi API thật, ví dụ:
    //   const res = await fetch("/api/chat", {
    //     method: "POST",
    //     body: JSON.stringify({ cauHoi: noiDung, hoSo: docOnboarding() }),
    //   });
    //   const data = await res.json();
    //   setTinNhan(cu => [...cu, { ai: "bot", noiDung: data.traLoi, nguon: data.nguon }]);
    //
    // Trả về đúng dạng TinNhan ở trên. Trường `nguon` là bắt buộc theo đề bài.
    setTimeout(() => setTinNhan((cu) => [...cu, TRA_LOI_MAU]), 500);
    // =======================================
  }

  const moiBatDau = tinNhan.length === 1;

  return (
    <main className="flex flex-1 flex-col bg-gradient-to-b from-brand-soft via-bg to-bg pb-32">
      {/* ---- Tiêu đề ---- */}
      <header className="flex items-center gap-3 px-5 pt-6">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-sky-300 to-fuchsia-300" />
        <div>
          <p className="text-sm font-bold">Trợ lý hỗ trợ bảo vệ người lao động</p>
          <p className="text-xs text-muted">Bắt đầu cuộc trò chuyện</p>
        </div>
      </header>

      {/* ---- 4 card gợi ý, chỉ hiện khi chưa hỏi gì ---- */}
      {moiBatDau && (
        <div className="mt-5 grid grid-cols-2 gap-3 px-5">
          {GOI_Y_CHAT.map((g) => (
            <button
              key={g}
              onClick={() => guiCauHoi(g)}
              className="rounded-2xl bg-surface/80 p-3 text-left text-[11px] font-medium leading-snug text-text shadow-sm"
            >
              {g}
            </button>
          ))}
        </div>
      )}

      {/* ---- Bong bóng hội thoại ---- */}
      <div className="mt-5 flex flex-col gap-3 px-5">
        {tinNhan.map((t, i) => (
          <BongBong key={i} tin={t} />
        ))}
      </div>

      {/* ---- Ô nhập ---- */}
      <div className="mt-6 px-5">
        <div className="rounded-2xl bg-surface p-3 shadow-sm">
          <input
            value={dangGo}
            onChange={(e) => setDangGo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && guiCauHoi(dangGo)}
            placeholder="Nhập câu hỏi của bạn..."
            className="w-full bg-transparent px-1 pb-6 text-sm outline-none placeholder:text-muted"
          />
          <div className="flex items-center justify-between">
            <button className="flex items-center gap-1.5 text-xs font-medium text-text">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
                <path d="M21 12.5 12.5 21a5 5 0 0 1-7-7l8.5-8.5a3.5 3.5 0 0 1 5 5L11 18.5a2 2 0 0 1-3-3l8-8" />
              </svg>
              Gắn tệp
            </button>
            <button className="flex items-center gap-1.5 rounded-full bg-text px-4 py-2 text-xs font-semibold text-white">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <path d="M6 10v4M10 7v10M14 5v14M18 9v6" />
              </svg>
              Gửi giọng nói
            </button>
          </div>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}

function BongBong({ tin }: { tin: TinNhan }) {
  const laBot = tin.ai === "bot";

  return (
    <div className={laBot ? "" : "flex justify-end"}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          laBot ? "bg-surface text-text" : "bg-brand-soft text-text"
        }`}
      >
        {/* Đoạn nào bọc ** ** thì in đậm, đó là 4 tiêu đề trong câu trả lời */}
        {tin.noiDung.split("\n").map((dong, i) =>
          dong.startsWith("**") ? (
            <p key={i} className="mt-3 font-bold">
              {dong.replaceAll("**", "")}
            </p>
          ) : (
            <p key={i} className={dong ? "" : "h-1"}>
              {dong}
            </p>
          )
        )}

        {/* ---- Dòng nguồn + nút liên hệ, đề bài yêu cầu bắt buộc ---- */}
        {laBot && tin.nguon && (
          <div className="mt-3 border-t border-line pt-3">
            <a
              href={tin.nguon.url}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-brand underline"
            >
              Nguồn: {tin.nguon.ten}
            </a>
            <Link
              href="/ho-tro"
              className="mt-2 block w-fit rounded-full bg-brand-soft px-3 py-1.5 text-[11px] font-semibold text-brand"
            >
              Liên hệ RMWC
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
