"use client";

/**
 * Màn Bản tóm tắt gửi RMWC — đường dẫn "/tom-tat"
 *
 * Đây là tính năng đề bài gọi đúng tên trong phần Safe Referral Pathways:
 *   "With user consent, generate a structured summary with the main concern,
 *    dates, evidence, preferred language and assistance type requested."
 *
 * Hai trạng thái trong một trang, giống màn Kiểm tra:
 *   form  -> người dùng điền, ô đồng ý chưa tick thì nút tạo vẫn mờ
 *   xem   -> hiện bản tóm tắt, đổi được tiếng Việt / tiếng Anh, bấm Sao chép
 *
 * App KHÔNG gửi bản tóm tắt đi đâu. Người dùng tự sao chép rồi tự dán.
 * Đây là điểm để nói trong pitch: người dùng giữ quyền quyết định đến phút cuối.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { docOnboarding } from "@/lib/onboarding";
import {
  CON_LAM,
  DuLieuTomTat,
  KiemTraDaLuu,
  LOAI_HO_TRO,
  MINH_CHUNG,
  NGON_NGU,
  TOM_TAT_RONG,
  ThongTinNguoiDung,
  VAN_DE,
  docKiemTra,
  taoBanTomTat,
  tomLuocGhiChep,
} from "@/lib/tom-tat";
import { Kho, KHO_RONG, docKho } from "@/lib/cong-viec";

export default function TomTatPage() {
  const [d, setD] = useState<DuLieuTomTat>(TOM_TAT_RONG);
  const [dongY, setDongY] = useState(false);
  const [xem, setXem] = useState(false);
  const [lang, setLang] = useState<"vi" | "en">("vi");
  const [daCopy, setDaCopy] = useState(false);

  const [nd, setNd] = useState<ThongTinNguoiDung>({
    ten: "",
    visa: "",
    nganh: "",
    hinhThuc: "",
  });
  const [kt, setKt] = useState<KiemTraDaLuu | null>(null);
  const [kho, setKho] = useState<Kho>(KHO_RONG);

  // Đọc hồ sơ onboarding và kết quả kiểm tra gần nhất từ máy người dùng.
  // Phải đọc trong useEffect vì localStorage không có lúc Next render trên server.
  useEffect(() => {
    const o = docOnboarding();
    if (o)
      setNd({
        ten: o.ten,
        visa: o.visa,
        nganh: o.nganh,
        hinhThuc: o.hinh_thuc,
      });
    setKt(docKiemTra());
    setKho(docKho());
  }, []);

  /** Bật tắt một mục trong danh sách chọn nhiều */
  function doi(truong: "vanDe" | "minhChung", v: string) {
    setD((cu) => {
      const ds = cu[truong];
      return {
        ...cu,
        [truong]: ds.includes(v) ? ds.filter((x) => x !== v) : [...ds, v],
      };
    });
  }

  const ghiChep = tomLuocGhiChep(kho);
  const vanBan = taoBanTomTat(d, nd, kt, lang, kho);

  async function saoChep() {
    try {
      await navigator.clipboard.writeText(vanBan);
      setDaCopy(true);
      setTimeout(() => setDaCopy(false), 2500);
    } catch {
      // Trình duyệt chặn clipboard (hay gặp khi mở bằng http trên điện thoại).
      // Không báo lỗi suông, chỉ nhắc người dùng bôi đen chọn tay.
      setDaCopy(false);
      alert("Trình duyệt không cho sao chép tự động. Bạn bôi đen đoạn chữ rồi sao chép bằng tay nhé.");
    }
  }

  /* ==================== TRẠNG THÁI XEM BẢN TÓM TẮT ==================== */
  if (xem) {
    return (
      <main className="flex flex-1 flex-col px-5 pb-32 pt-6">
        <button onClick={() => setXem(false)} className="self-start text-sm text-brand">
          ‹ Sửa lại thông tin
        </button>

        <h1 className="mt-4 text-xl font-bold">Bản tóm tắt của bạn</h1>
        <p className="mt-1 text-sm text-muted">
          Bản này đang nằm trên máy bạn. Chỉ khi bạn tự gửi thì RMWC mới nhận được.
        </p>

        {/* Đổi ngôn ngữ. Có bản tiếng Anh vì cán bộ tiếp nhận không phải ai cũng
            đọc được tiếng Việt, mà người dùng thì viết tiếng Việt dễ hơn. */}
        <div className="mt-4 flex gap-2">
          <NutNgonNgu dang={lang === "vi"} onClick={() => setLang("vi")}>
            Tiếng Việt
          </NutNgonNgu>
          <NutNgonNgu dang={lang === "en"} onClick={() => setLang("en")}>
            English
          </NutNgonNgu>
        </div>

        <pre className="mt-4 whitespace-pre-wrap rounded-2xl bg-surface p-4 text-[12px] leading-relaxed text-text">
          {vanBan}
        </pre>

        <button
          onClick={saoChep}
          className="mt-4 w-full rounded-xl bg-brand py-4 text-sm font-semibold text-white"
        >
          {daCopy ? "Đã sao chép" : "Sao chép bản tóm tắt"}
        </button>

        <div className="mt-4 rounded-2xl bg-brand-soft p-4 text-sm leading-relaxed">
          <p className="font-semibold text-brand">Gửi đi bằng cách nào</p>
          <p className="mt-2">
            Dán vào form liên hệ trên trang migrants.org.au, hoặc dán vào email,
            Zalo, Messenger khi bạn nhắn cho cán bộ RMWC. Bạn cũng có thể mở màn
            hình này ra đọc khi gọi điện.
          </p>
          <Link
            href="/ho-tro"
            className="mt-3 block rounded-xl bg-brand py-3 text-center text-sm font-semibold text-white"
          >
            Xem cách liên hệ RMWC
          </Link>
        </div>

        <p className="mt-4 text-center text-[11px] leading-relaxed text-muted">
          Bạn có thể quay lại sửa hoặc bỏ đi bất cứ lúc nào.
          <br />
          Không có bản nào được lưu trên máy chủ của chúng tôi.
        </p>

        <BottomNav />
      </main>
    );
  }

  /* ==================== TRẠNG THÁI FORM ==================== */
  return (
    <main className="flex flex-1 flex-col px-5 pb-32 pt-6">
      <p className="eyebrow">KHI BẠN SẴN SÀNG NHỜ HỖ TRỢ</p>
      <h1 className="mt-1.5 text-2xl font-bold">Bản tóm tắt gửi RMWC</h1>
      <p className="mt-1 text-sm leading-relaxed text-muted">
        Trả lời vài câu, ứng dụng sẽ sắp xếp thành một bản tóm tắt gọn gàng để
        bạn gửi cho cán bộ RMWC. Bạn không phải tự nghĩ cách diễn đạt.
      </p>

      {/* Ô đồng ý. Đề bài ghi "with user consent" nên không được tạo trước khi tick. */}
      <label className="mt-5 flex gap-3 rounded-2xl bg-brand-soft p-4">
        <input
          type="checkbox"
          checked={dongY}
          onChange={(e) => setDongY(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-brand"
        />
        <span className="text-sm leading-relaxed text-text">
          Tôi đồng ý cho ứng dụng sắp xếp những gì tôi điền thành một bản tóm tắt.
          Tôi hiểu bản tóm tắt chỉ nằm trên máy của tôi, và chỉ được gửi khi
          chính tôi sao chép và gửi đi.
        </span>
      </label>

      <div className="mt-6 flex flex-col gap-6">
        {/* ---- 1. Vấn đề chính ---- */}
        <Phan
          so="1"
          ten="Điều gì đang làm bạn lo"
          ghiChu="Chọn tất cả những mục đúng với bạn"
        >
          <div className="flex flex-col gap-2">
            {VAN_DE.map((o) => (
              <NutChon
                key={o.value}
                chon={d.vanDe.includes(o.value)}
                onClick={() => doi("vanDe", o.value)}
              >
                {o.vi}
              </NutChon>
            ))}
          </div>
          <textarea
            value={d.vanDeThem}
            onChange={(e) => setD({ ...d, vanDeThem: e.target.value })}
            rows={3}
            placeholder="Muốn kể thêm bằng lời của bạn thì viết ở đây (không bắt buộc)"
            className="mt-3 w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-brand"
          />
        </Phan>

        {/* ---- 2. Mốc thời gian ---- */}
        <Phan
          so="2"
          ten="Thời gian"
          ghiChu="Không cần chính xác ngày, nhớ khoảng nào ghi khoảng đó"
        >
          <input
            value={d.batDauLam}
            onChange={(e) => setD({ ...d, batDauLam: e.target.value })}
            placeholder="Bắt đầu làm từ khi nào, ví dụ: tháng 3 năm 2026"
            className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-brand"
          />
          <input
            value={d.vanDeTuKhiNao}
            onChange={(e) => setD({ ...d, vanDeTuKhiNao: e.target.value })}
            placeholder="Vấn đề xuất hiện từ khi nào, ví dụ: khoảng 2 tháng nay"
            className="mt-2 w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-brand"
          />
          <div className="mt-2 flex gap-2">
            {CON_LAM.map((o) => (
              <NutChon
                key={o.value}
                chon={d.conLam === o.value}
                onClick={() => setD({ ...d, conLam: o.value })}
              >
                {o.vi}
              </NutChon>
            ))}
          </div>
        </Phan>

        {/* ---- 3. Minh chứng ---- */}
        <Phan
          so="3"
          ten="Bạn đang giữ những gì"
          ghiChu="Chưa có gì cũng không sao, cán bộ vẫn hỗ trợ được"
        >
          <div className="flex flex-col gap-2">
            {MINH_CHUNG.map((o) => (
              <NutChon
                key={o.value}
                chon={d.minhChung.includes(o.value)}
                onClick={() => doi("minhChung", o.value)}
              >
                {o.vi}
              </NutChon>
            ))}
          </div>

          {/* Ghi chép ca làm trong app là minh chứng mạnh nhất người dùng có,
              nhưng vẫn để họ tự quyết định có gửi kèm hay không. */}
          {ghiChep && (
            <label className="mt-3 flex gap-3 rounded-xl bg-brand-soft p-3">
              <input
                type="checkbox"
                checked={d.guiKemGhiChep}
                onChange={(e) => setD({ ...d, guiKemGhiChep: e.target.checked })}
                className="mt-0.5 h-4 w-4 shrink-0 accent-brand"
              />
              <span className="text-sm leading-relaxed">
                Gửi kèm ghi chép ca làm của tôi trong app:{" "}
                <b>
                  {ghiChep.soCa} ca, {ghiChep.tongGio} giờ, từ {ghiChep.tuNgay} đến{" "}
                  {ghiChep.denNgay}
                </b>
                .
              </span>
            </label>
          )}
        </Phan>

        {/* ---- 4. Ngôn ngữ ---- */}
        <Phan so="4" ten="Bạn muốn nói chuyện bằng tiếng gì">
          <div className="flex flex-col gap-2">
            {NGON_NGU.map((o) => (
              <NutChon
                key={o.value}
                chon={d.ngonNgu === o.value}
                onClick={() => setD({ ...d, ngonNgu: o.value })}
              >
                {o.vi}
              </NutChon>
            ))}
          </div>
        </Phan>

        {/* ---- 5. Loại hỗ trợ ---- */}
        <Phan
          so="5"
          ten="Bạn mong được giúp việc gì"
          ghiChu="Chọn mục đầu cũng hoàn toàn ổn, bạn không bắt buộc phải làm gì thêm"
        >
          <div className="flex flex-col gap-2">
            {LOAI_HO_TRO.map((o) => (
              <NutChon
                key={o.value}
                chon={d.loaiHoTro === o.value}
                onClick={() => setD({ ...d, loaiHoTro: o.value })}
              >
                {o.vi}
              </NutChon>
            ))}
          </div>
        </Phan>

        {/* ---- 6. Liên hệ lại + visa ---- */}
        <Phan
          so="6"
          ten="Cách liên hệ lại"
          ghiChu="Để trống cũng được, bạn vẫn gọi cho RMWC được"
        >
          <input
            value={d.lienHeLai}
            onChange={(e) => setD({ ...d, lienHeLai: e.target.value })}
            placeholder="Số điện thoại hoặc email, nếu bạn muốn được liên hệ lại"
            className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-brand"
          />

          {/* Visa mặc định KHÔNG gửi kèm. Nhóm người dùng này sợ nhất là thông
              tin visa bị dùng để chống lại mình, nên phải để họ tự chọn. */}
          {nd.visa && (
            <label className="mt-3 flex gap-3 rounded-xl bg-surface p-3">
              <input
                type="checkbox"
                checked={d.guiKemVisa}
                onChange={(e) => setD({ ...d, guiKemVisa: e.target.checked })}
                className="mt-0.5 h-4 w-4 shrink-0 accent-brand"
              />
              <span className="text-sm leading-relaxed">
                Gửi kèm loại visa của tôi. Cán bộ biết loại visa sẽ tư vấn sát
                hơn, nhưng bạn không bắt buộc phải cho biết.
              </span>
            </label>
          )}
        </Phan>
      </div>

      {/* Nhắc người dùng biết app đã tự lấy sẵn những gì, không lấy âm thầm */}
      <p className="mt-6 rounded-xl bg-surface p-3 text-[11px] leading-relaxed text-muted">
        {kt
          ? "Ứng dụng sẽ tự điền thêm ngành nghề, hình thức làm việc và kết quả kiểm tra lương gần nhất của bạn vào bản tóm tắt."
          : "Bạn chưa chạy Kiểm tra công việc. Chạy trước rồi quay lại thì bản tóm tắt sẽ có thêm phần đối chiếu lương, cán bộ đọc sẽ nhanh hiểu hơn."}
      </p>

      <button
        onClick={() => {
          setXem(true);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        disabled={!dongY || d.vanDe.length === 0}
        className="mt-4 w-full rounded-xl bg-brand py-4 text-sm font-semibold text-white disabled:opacity-40"
      >
        Tạo bản tóm tắt
      </button>
      {!dongY && (
        <p className="mt-2 text-center text-[11px] text-muted">
          Tick ô đồng ý ở trên để tạo
        </p>
      )}

      <BottomNav />
    </main>
  );
}

/* ==================== Các mảnh giao diện nhỏ ==================== */

function Phan({
  so,
  ten,
  ghiChu,
  children,
}: {
  so: string;
  ten: string;
  ghiChu?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-sm font-bold">
        <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[11px] text-white">
          {so}
        </span>
        {ten}
      </h2>
      {ghiChu && <p className="mb-3 mt-1 text-xs text-muted">{ghiChu}</p>}
      <div className={ghiChu ? "" : "mt-3"}>{children}</div>
    </section>
  );
}

function NutChon({
  chon,
  onClick,
  children,
}: {
  chon: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl border px-4 py-3 text-left text-sm leading-snug ${
        chon ? "border-brand bg-brand-soft font-medium" : "border-line bg-surface"
      }`}
    >
      {children}
    </button>
  );
}

function NutNgonNgu({
  dang,
  onClick,
  children,
}: {
  dang: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-xs font-semibold ${
        dang ? "bg-brand text-white" : "bg-surface text-muted"
      }`}
    >
      {children}
    </button>
  );
}
