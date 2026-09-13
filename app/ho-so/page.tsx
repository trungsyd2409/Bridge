"use client";

/**
 * Màn Hồ sơ — đường dẫn "/ho-so"
 * Đây là mục thứ ba trên thanh nav. Trước đó mục "Hồ sơ" trỏ sang /ho-tro
 * nên bấm vào ra màn Yêu cầu hỗ trợ, sai nhãn. File này sửa chỗ đó.
 *
 * Màn này làm ba việc:
 *   1. Cho người dùng xem lại những gì app đang giữ về họ
 *   2. Cho họ xoá sạch bằng một nút, xoá thật, không phải xoá giả
 *   3. Là chỗ vào của Bản tóm tắt gửi RMWC
 *
 * Mục 2 là điểm để nói trong pitch: dữ liệu nằm trên máy người dùng nên họ
 * xoá được, khác với app có server giữ dữ liệu hộ.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import ChonGiaoDien from "@/components/ChonGiaoDien";
import {
  HINH_THUC_OPTIONS,
  KINH_NGHIEM_OPTIONS,
  NGANH_OPTIONS,
  OnboardingData,
  VISA_OPTIONS,
  docOnboarding,
  timNhan,
  xoaOnboarding,
} from "@/lib/onboarding";
import { docKiemTra, xoaKiemTra } from "@/lib/tom-tat";
import {
  Kho,
  KHO_RONG,
  docKho,
  gioCuaCa,
  timCongViec,
  xoaKho,
} from "@/lib/cong-viec";

export default function HoSoPage() {
  const [d, setD] = useState<OnboardingData | null>(null);
  const [coKiemTra, setCoKiemTra] = useState(false);
  const [kho, setKho] = useState<Kho>(KHO_RONG);
  const [hoiXoa, setHoiXoa] = useState(false);
  const [daXoa, setDaXoa] = useState(false);

  useEffect(() => {
    setD(docOnboarding());
    setCoKiemTra(docKiemTra() !== null);
    setKho(docKho());
  }, []);

  function xoaHet() {
    xoaOnboarding();
    xoaKiemTra();
    xoaKho();
    setD(null);
    setCoKiemTra(false);
    setKho(KHO_RONG);
    setHoiXoa(false);
    setDaXoa(true);
  }

  return (
    <main className="flex flex-1 flex-col px-5 pb-32 pt-6">
      <p className="eyebrow">CỦA RIÊNG BẠN</p>
      <h1 className="mt-1.5 text-2xl font-bold">Hồ sơ của bạn</h1>
      <p className="mt-1 text-sm leading-relaxed text-muted">
        Đây là toàn bộ những gì BRIDGE đang giữ. Tất cả nằm trên máy của bạn,
        không nằm trên máy chủ của chúng tôi.
      </p>

      {/* ---- Bảng thông tin ---- */}
      <section className="mt-5 rounded-2xl bg-surface p-4">
        {d ? (
          <div className="flex flex-col gap-3">
            <Dong nhan="Tên bạn đã nhập" gt={d.ten || "Bạn chọn dùng ẩn danh"} />
            <Dong nhan="Loại visa" gt={timNhan(VISA_OPTIONS, d.visa)} />
            <Dong
              nhan="Kinh nghiệm làm việc"
              gt={timNhan(KINH_NGHIEM_OPTIONS, d.kinh_nghiem)}
            />
            <Dong nhan="Ngành nghề" gt={timNhan(NGANH_OPTIONS, d.nganh)} />
            <Dong
              nhan="Hình thức làm việc"
              gt={timNhan(HINH_THUC_OPTIONS, d.hinh_thuc)}
            />
            <Dong
              nhan="Kết quả kiểm tra công việc"
              gt={coKiemTra ? "Đã lưu lần kiểm tra gần nhất" : "Chưa có"}
            />
            <Dong
              nhan="Nơi làm việc đã thêm"
              gt={kho.congViec.length > 0 ? `${kho.congViec.length} nơi` : "Chưa có"}
            />
            <Dong
              nhan="Ca làm đã ghi"
              gt={kho.caLam.length > 0 ? `${kho.caLam.length} ca` : "Chưa có"}
            />
          </div>
        ) : (
          <p className="text-sm leading-relaxed text-muted">
            {daXoa
              ? "Đã xoá. Trên máy bạn không còn dữ liệu nào của BRIDGE."
              : "Chưa có thông tin nào. Bạn có thể trả lời vài câu để app gợi ý sát hơn."}
          </p>
        )}
      </section>

      {!d && (
        <Link
          href="/onboarding"
          className="mt-3 block rounded-xl bg-brand py-3.5 text-center text-sm font-semibold text-white"
        >
          Trả lời vài câu hỏi
        </Link>
      )}

      {/* ---- Giao diện ----
          Đúng vị trí bản thiết kế 08 đặt nó: trong Hồ sơ, mục Trải nghiệm. */}
      <section className="vien-the mt-5 rounded-2xl bg-surface p-4">
        <h2 className="text-sm font-bold">Giao diện</h2>
        <p className="mt-1.5 text-xs text-muted">
          Chọn nền sáng, nền tối, hoặc để app đi theo cài đặt của máy bạn.
        </p>
        <div className="mt-3">
          <ChonGiaoDien />
        </div>
      </section>

      {/* ---- Lối vào Bản tóm tắt ---- */}
      <section className="mt-5 rounded-2xl bg-brand-soft p-4">
        <h2 className="text-sm font-bold text-brand">Bản tóm tắt gửi RMWC</h2>
        <p className="mt-2 text-sm leading-relaxed">
          Nếu bạn muốn nhờ RMWC hỗ trợ, app giúp bạn sắp xếp sự việc thành một
          bản tóm tắt gọn gàng. Bạn tự đọc lại, tự quyết định có gửi hay không.
        </p>
        <Link
          href="/tom-tat"
          className="mt-3 block rounded-xl bg-brand py-3 text-center text-sm font-semibold text-white"
        >
          Tạo bản tóm tắt
        </Link>
      </section>

      {/* ---- Các lối đi khác ---- */}
      <div className="mt-5 flex flex-col gap-2">
        <LoiDi href="/cong-viec" nhan="Công việc của tôi" />
        <LoiDi href="/lich-lam" nhan="Lịch làm việc" />
        <LoiDi href="/kiem-tra" nhan="Kiểm tra công việc hiện tại" />
        <LoiDi href="/hoc" nhan="Tìm hiểu quyền lợi người lao động" />
        <LoiDi href="/ho-tro" nhan="Danh bạ tổ chức hỗ trợ" />
      </div>

      {/* ---- Xuất ghi chép ----
          Đề bài nói về việc người lao động giữ được bằng chứng của chính mình.
          Xuất ra file CSV để họ mở bằng Excel, in ra, hoặc gửi kèm email. */}
      {kho.caLam.length > 0 && (
        <section className="mt-5 rounded-2xl bg-surface p-4">
          <h2 className="text-sm font-bold">Xuất ghi chép ca làm</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Tải toàn bộ ca làm bạn đã ghi thành một file bảng tính. Mở được bằng
            Excel hoặc Google Sheets, in ra hoặc gửi kèm cho cán bộ hỗ trợ.
          </p>
          <button
            onClick={() => xuatCSV(kho)}
            className="mt-3 w-full rounded-xl bg-brand-soft py-3 text-sm font-semibold text-brand"
          >
            Tải file ghi chép ({kho.caLam.length} ca)
          </button>
        </section>
      )}

      {/* ---- Xoá dữ liệu ---- */}
      <section className="mt-6 rounded-2xl bg-surface p-4">
        <h2 className="text-sm font-bold">Xoá dữ liệu của tôi</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Xoá sạch mọi thứ bạn đã nhập: hồ sơ, kết quả kiểm tra lương, nơi làm
          việc và toàn bộ ca làm đã ghi. Việc này không hoàn lại được. Nếu bạn
          muốn giữ lại ghi chép, hãy tải file ở trên trước khi xoá.
        </p>

        {hoiXoa ? (
          <div className="mt-3 flex gap-2">
            <button
              onClick={xoaHet}
              className="flex-1 rounded-xl bg-danger py-3 text-sm font-semibold text-white"
            >
              Xoá thật
            </button>
            <button
              onClick={() => setHoiXoa(false)}
              className="flex-1 rounded-xl border border-line bg-surface py-3 text-sm font-semibold"
            >
              Thôi, giữ lại
            </button>
          </div>
        ) : (
          <button
            onClick={() => setHoiXoa(true)}
            disabled={
              !d && !coKiemTra && kho.caLam.length === 0 && kho.congViec.length === 0
            }
            className="mt-3 w-full rounded-xl bg-danger-soft py-3 text-sm font-semibold text-danger disabled:opacity-40"
          >
            Xoá dữ liệu của tôi
          </button>
        )}
      </section>

      <p className="mt-5 text-center text-[11px] leading-relaxed text-muted">
        BRIDGE không thu thập email hay số điện thoại của bạn.
        <br />
        Chúng tôi đưa thông tin, không đưa tư vấn pháp lý.
      </p>

      <BottomNav />
    </main>
  );
}

/**
 * Xuất ca làm ra CSV. Dùng dấu chấm phẩy làm dấu ngăn vì Excel bản tiếng Việt
 * mở CSV ngăn bằng dấu phẩy hay bị dồn hết vào một cột.
 * Thêm BOM ở đầu file để Excel hiện đúng dấu tiếng Việt.
 */
function xuatCSV(kho: Kho) {
  const dau = [
    "Ngày",
    "Nơi làm việc",
    "Bắt đầu",
    "Kết thúc",
    "Nghỉ không lương (phút)",
    "Số giờ tính lương",
    "Trạng thái",
    "Thanh toán",
    "Số tiền đã nhận",
    "Payslip",
    "Ghi chú",
  ];

  const nhanTra: Record<string, string> = {
    chua_ghi_nhan: "Chưa ghi nhận",
    da_nhan: "Đã nhận",
    chua_nhan: "Chưa được trả",
  };
  const nhanPayslip: Record<string, string> = {
    co: "Có",
    khong: "Không",
    chua_ro: "Chưa rõ",
  };

  const hang = [...kho.caLam]
    .sort((a, b) => a.ngay.localeCompare(b.ngay))
    .map((c) => [
      c.ngay,
      timCongViec(kho, c.congViecId)?.ten ?? "",
      c.batDau,
      c.ketThuc,
      String(c.nghiPhut),
      String(gioCuaCa(c)),
      c.daLam ? "Đã làm" : "Dự kiến",
      nhanTra[c.thanhToan] ?? "",
      c.soTien !== null ? c.soTien.toFixed(2) : "",
      nhanPayslip[c.payslip] ?? "",
      c.ghiChu.replace(/[\r\n;]/g, " "),
    ]);

  const noiDung =
    "\uFEFF" + [dau, ...hang].map((r) => r.join(";")).join("\r\n");

  const blob = new Blob([noiDung], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "bridge-ghi-chep-ca-lam.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function Dong({ nhan, gt }: { nhan: string; gt: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-line pb-2.5 last:border-0 last:pb-0">
      <span className="text-xs text-muted">{nhan}</span>
      <span className="max-w-[60%] text-right text-sm font-medium">
        {gt || "Bạn đã bỏ qua câu này"}
      </span>
    </div>
  );
}

function LoiDi({ href, nhan }: { href: string; nhan: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-xl bg-surface px-4 py-3.5 text-sm font-medium"
    >
      {nhan}
      <span aria-hidden className="text-muted">
        ›
      </span>
    </Link>
  );
}
