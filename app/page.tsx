import Link from "next/link";

/**
 * Màn Splash — đường dẫn "/"
 *
 * Dựng theo bản 09 của anh Nguyễn: nền xanh đậm, đường chân trời Sydney, logo
 * cây cầu, câu tagline, rồi vào app.
 *
 * Hình vẽ bằng SVG viết tay ngay trong file chứ không dùng ảnh, vì ảnh nền
 * nặng vài trăm KB và mở trên mạng yếu ở chỗ thi sẽ hiện chậm. SVG này nặng
 * khoảng 2KB và sắc nét ở mọi kích thước màn hình.
 *
 * Đây là Server Component (không có "use client") vì màn này không có state,
 * chỉ có hai cái link.
 */
export default function SplashPage() {
  return (
    <main className="relative flex flex-1 flex-col overflow-hidden">
      {/* ---- Nền xanh đậm phủ toàn màn, không phụ thuộc giao diện sáng tối ---- */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#0b2a6b_0%,#0d47c2_52%,#0a2f7d_100%)]" />

      {/* ---- Đường chân trời Sydney ---- */}
      <DuongChanTroi />

      {/* ---- Nội dung ---- */}
      <div className="relative flex flex-1 flex-col px-6 pb-10 pt-24">
        <div className="flex flex-1 flex-col items-center text-center">
          <LogoCau />

          <p className="mt-6 text-[28px] font-extrabold tracking-[0.22em] text-white">
            BRIDGE
          </p>

          <p className="mt-3 text-[15px] font-medium text-white/80">
            Hiểu quyền lợi. Tự tin bước tiếp.
          </p>

          <div className="mx-auto mt-6 h-px w-16 bg-white/25" />

          <h1 className="mt-6 text-[22px] font-bold leading-snug text-white">
            Cùng người Việt, vững bước tại Úc
          </h1>

          <p className="mt-4 max-w-[19rem] text-[14px] leading-relaxed text-white/75">
            Hiểu quyền lợi của mình, ghi lại giờ làm, đối chiếu lương với bảng
            lương ngành, và kết nối với tổ chức hỗ trợ khi bạn cần.
          </p>
        </div>

        {/* ---- Lời hứa về quyền riêng tư, để ngay trước nút bấm ----
            Đây là điều đầu tiên nhóm người dùng này muốn biết, nên nói trước
            khi mời họ đi tiếp chứ không giấu vào mục điều khoản. */}
        <div className="mb-4 flex items-start gap-2.5 rounded-2xl bg-white/10 p-3.5 text-left">
          <svg
            viewBox="0 0 24 24"
            className="mt-0.5 h-4 w-4 shrink-0 text-white/80"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            aria-hidden="true"
          >
            <rect x="4" y="10" width="16" height="10" rx="2" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
          </svg>
          <p className="text-[12px] leading-relaxed text-white/80">
            Không cần tài khoản, không cần email. Mọi thứ bạn nhập chỉ nằm trên
            máy của bạn.
          </p>
        </div>

        <Link
          href="/onboarding"
          className="block w-full rounded-2xl bg-white py-4 text-center text-[16px] font-bold text-[#0d47c2] active:bg-white/90"
        >
          Bắt đầu
        </Link>

        <Link
          href="/home"
          className="mt-3 block py-2 text-center text-sm font-semibold text-white/75"
        >
          Khám phá trước
        </Link>
      </div>
    </main>
  );
}

/* ==================== Logo cây cầu ==================== */

function LogoCau() {
  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-[26px] bg-white/12 ring-1 ring-white/25">
      <svg
        viewBox="0 0 48 32"
        className="h-11 w-11 text-white"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        aria-hidden="true"
      >
        {/* nhịp cầu */}
        <path d="M3 24C3 12 12.5 5 24 5s21 7 21 19" />
        {/* mặt cầu */}
        <path d="M2 24h44" />
        {/* dây văng */}
        <path d="M11 24v-8M18 24v-11.5M24 24V11.5M30 24v-11.5M37 24v-8" strokeWidth={1.5} />
        {/* hai trụ */}
        <path d="M7 24v6M41 24v6" strokeWidth={2.6} />
      </svg>
    </div>
  );
}

/* ==================== Đường chân trời Sydney ==================== */

function DuongChanTroi() {
  return (
    <svg
      viewBox="0 0 390 150"
      preserveAspectRatio="none"
      className="absolute bottom-0 left-0 h-[150px] w-full"
      aria-hidden="true"
    >
      {/* lớp nhà cao tầng phía xa, mờ hơn */}
      <g fill="#ffffff" opacity="0.1">
        <rect x="196" y="58" width="13" height="70" />
        <rect x="213" y="44" width="9" height="84" />
        <rect x="226" y="66" width="16" height="62" />
        <rect x="246" y="52" width="11" height="76" />
        <rect x="261" y="72" width="14" height="56" />
        <rect x="279" y="62" width="10" height="66" />
        <rect x="293" y="78" width="17" height="50" />
        <rect x="314" y="68" width="12" height="60" />
        <rect x="330" y="84" width="15" height="44" />
        <rect x="349" y="74" width="11" height="54" />
        <rect x="364" y="88" width="18" height="40" />
        {/* tháp truyền hình Sydney Tower */}
        <rect x="216" y="18" width="3" height="30" />
        <ellipse cx="217.5" cy="40" rx="7" ry="5" />
      </g>

      {/* nhà hát Opera, ba lớp vỏ sò */}
      <g fill="#ffffff" opacity="0.17">
        <path d="M18 128c0-26 14-44 30-48-6 14-7 32-4 48z" />
        <path d="M44 128c0-30 16-50 34-55-7 16-9 37-5 55z" />
        <path d="M74 128c0-24 13-41 28-45-6 13-7 30-4 45z" />
        <rect x="14" y="124" width="96" height="6" rx="3" />
      </g>

      {/* cầu cảng Sydney Harbour Bridge */}
      <g stroke="#ffffff" opacity="0.17" fill="none">
        <path d="M116 124C116 96 140 80 168 80s52 16 52 44" strokeWidth="3.5" />
        <path d="M112 124h112" strokeWidth="3.5" />
        <path
          d="M128 124v-14M142 124v-22M156 124v-28M168 124v-30M180 124v-28M194 124v-22M208 124v-14"
          strokeWidth="1.8"
        />
        <path d="M120 124v14M216 124v14" strokeWidth="5" />
      </g>

      {/* mặt nước */}
      <g opacity="0.13" fill="#ffffff">
        <rect x="0" y="136" width="390" height="2" rx="1" />
        <rect x="34" y="143" width="60" height="2" rx="1" />
        <rect x="140" y="143" width="90" height="2" rx="1" />
        <rect x="268" y="143" width="54" height="2" rx="1" />
      </g>
    </svg>
  );
}
