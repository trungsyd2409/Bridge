/**
 * Công việc và ca làm — phần dữ liệu.
 *
 * Đây là phần mới theo bản UI 01, 02, 03, 05 của anh Nguyễn.
 * Ý tưởng gốc: người lao động tự ghi lại giờ làm của mình.
 *
 * VÌ SAO TÍNH NĂNG NÀY QUAN TRỌNG, nói được trong pitch:
 * Fair Work Act 2009 mục 557C — khi chủ không giữ hồ sơ giờ làm và không phát
 * phiếu lương, gánh nặng chứng minh chuyển sang chủ. Lúc đó ghi chép của chính
 * người lao động trở thành thứ có sức nặng. App không đi kiện thay ai, app giúp
 * người ta có cái để cầm đi hỏi.
 *
 * Tất cả nằm trong localStorage, không có server, không có tài khoản.
 */

import { BANG_LUONG } from "@/lib/luong";

export const KEY_CV = "bridge_cong_viec";

/* ==================== Kiểu dữ liệu ==================== */

export type CongViec = {
  id: string;
  ten: string; // tên nơi làm, ví dụ "Quán cà phê A"
  viTri: string; // "Nhân viên phục vụ"
  nganh: string; // mã ngành, nối sang BANG_LUONG trong lib/luong.ts
  hinhThuc: string; // casual | part_time | full_time | hop_dong | khong_ro
  luongThoaThuan: number | null; // AUD mỗi giờ, theo lời chủ
  diaChi: string;
  abn: string;
  mau: string; // class màu chấm để phân biệt nơi làm
  dangLam: boolean;
};

export type CaLam = {
  id: string;
  congViecId: string;
  ngay: string; // "2026-09-13"
  batDau: string; // "09:00"
  ketThuc: string; // "17:00"
  nghiPhut: number; // nghỉ không lương, tính bằng phút
  daLam: boolean; // false nghĩa là ca dự kiến, chưa làm
  /** "chua_ghi_nhan" KHÔNG có nghĩa là chưa được trả, chỉ là người dùng chưa nhập */
  thanhToan: "chua_ghi_nhan" | "da_nhan" | "chua_nhan";
  soTien: number | null;
  ngayNhanTien: string;
  hinhThucNhan: string;
  payslip: string; // co | khong | chua_ro
  ghiChu: string;
};

export type Kho = {
  congViec: CongViec[];
  caLam: CaLam[];
};

export const KHO_RONG: Kho = { congViec: [], caLam: [] };

/* ==================== Đọc ghi localStorage ==================== */

export function docKho(): Kho {
  if (typeof window === "undefined") return KHO_RONG;
  try {
    const raw = window.localStorage.getItem(KEY_CV);
    if (!raw) return KHO_RONG;
    const p = JSON.parse(raw) as Partial<Kho>;
    return { congViec: p.congViec ?? [], caLam: p.caLam ?? [] };
  } catch {
    return KHO_RONG;
  }
}

export function ghiKho(k: Kho): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY_CV, JSON.stringify(k));
  } catch {
    /* localStorage bị chặn thì bỏ qua, không làm app chết */
  }
}

export function xoaKho(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY_CV);
  } catch {
    /* bỏ qua */
  }
}

/** Id ngắn, đủ dùng cho dữ liệu chỉ nằm trên một máy */
export function taoId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/* ==================== Màu phân biệt nơi làm ==================== */

export const MAU_CONG_VIEC = [
  "bg-brand",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
];

export function mauTiepTheo(soDaCo: number): string {
  return MAU_CONG_VIEC[soDaCo % MAU_CONG_VIEC.length];
}

/* ==================== Ngày giờ ==================== */

/** Đổi Date thành "2026-09-13" theo giờ máy người dùng, không dùng UTC */
export function ngayISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const n = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${n}`;
}

/** Thứ 2 của tuần chứa ngày d. Tuần ở Úc tính từ thứ 2. */
export function dauTuan(d: Date): Date {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const thu = x.getDay(); // 0 là chủ nhật
  const lui = thu === 0 ? 6 : thu - 1;
  x.setDate(x.getDate() - lui);
  return x;
}

/** 7 ngày của tuần chứa d, từ thứ 2 đến chủ nhật */
export function cacNgayTrongTuan(d: Date): string[] {
  const t2 = dauTuan(d);
  return Array.from({ length: 7 }, (_, i) => {
    const x = new Date(t2);
    x.setDate(t2.getDate() + i);
    return ngayISO(x);
  });
}

export const TEN_THU = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

/** "2026-09-13" thành "13/9" để hiện cho gọn */
export function ngayGon(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${Number(d)}/${Number(m)}`;
}

/* ==================== Tính giờ ==================== */

function phutTuGio(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

/**
 * Số giờ được tính lương của một ca.
 * Ca qua đêm (kết thúc sớm hơn bắt đầu) được cộng thêm 24 tiếng.
 * Trừ thời gian nghỉ không lương.
 */
export function gioCuaCa(ca: CaLam): number {
  const bd = phutTuGio(ca.batDau);
  let kt = phutTuGio(ca.ketThuc);
  if (kt <= bd) kt += 24 * 60;
  const phut = kt - bd - (ca.nghiPhut || 0);
  return phut > 0 ? Math.round((phut / 60) * 100) / 100 : 0;
}

/** "7,5 giờ" hoặc "7 giờ 30 phút" tuỳ chỗ dùng */
export function gioChu(gio: number): string {
  const g = Math.floor(gio);
  const p = Math.round((gio - g) * 60);
  return p === 0 ? `${g} giờ` : `${g} giờ ${p} phút`;
}

/* ==================== Tổng kết tuần ==================== */

export type TongKetTuan = {
  gioDaGhi: number; // giờ của các ca đã làm
  gioXepLich: number; // giờ của tất cả các ca trong tuần
  soCaDaLam: number;
  soCaSapToi: number;
  soNoiLamViec: number;
  tienDaGhiNhan: number; // tiền người dùng khai đã nhận
  /** Tiền lẽ ra nhận theo bảng lương ngành. null khi thiếu dữ liệu award. */
  tienTheoAward: number | null;
  /** Tiền theo mức chủ đã thoả thuận. null khi chưa nhập lương. */
  tienTheoThoaThuan: number | null;
  /** Tên các ngành chưa có bảng lương, để nói thật với người dùng */
  thieuAward: string[];
};

/**
 * Tính tổng kết một tuần.
 *
 * QUY TẮC GIỮ NGUYÊN TỪ MÀN KIỂM TRA: so với bảng lương ngành (award),
 * không so với lương tối thiểu quốc gia. Thiếu dữ liệu thì trả null,
 * KHÔNG đoán. Báo "ổn" cho người đang bị trả thiếu là lỗi tệ nhất app này
 * có thể mắc.
 */
export function tongKetTuan(kho: Kho, ngayTrongTuan: string[]): TongKetTuan {
  const cacCa = kho.caLam.filter((c) => ngayTrongTuan.includes(c.ngay));

  let gioDaGhi = 0;
  let gioXepLich = 0;
  let soCaDaLam = 0;
  let soCaSapToi = 0;
  let tienDaGhiNhan = 0;
  let tienAward = 0;
  let tienThoaThuan = 0;
  let thieuAward: string[] = [];
  let thieuThoaThuan = false;
  const noiLam = new Set<string>();

  for (const ca of cacCa) {
    const gio = gioCuaCa(ca);
    gioXepLich += gio;
    noiLam.add(ca.congViecId);

    if (!ca.daLam) {
      soCaSapToi += 1;
      continue;
    }

    gioDaGhi += gio;
    soCaDaLam += 1;
    if (ca.thanhToan === "da_nhan" && ca.soTien !== null) tienDaGhiNhan += ca.soTien;

    const cv = kho.congViec.find((c) => c.id === ca.congViecId);
    const bang = cv ? BANG_LUONG[cv.nganh] : undefined;

    if (cv && bang && cv.hinhThuc !== "khong_ro") {
      const muc = cv.hinhThuc === "casual" ? bang.casual : bang.coBan;
      tienAward += gio * muc;
    } else if (cv) {
      if (!thieuAward.includes(cv.ten)) thieuAward.push(cv.ten);
    }

    if (cv && cv.luongThoaThuan !== null) tienThoaThuan += gio * cv.luongThoaThuan;
    else thieuThoaThuan = true;
  }

  return {
    gioDaGhi: Math.round(gioDaGhi * 100) / 100,
    gioXepLich: Math.round(gioXepLich * 100) / 100,
    soCaDaLam,
    soCaSapToi,
    soNoiLamViec: noiLam.size,
    tienDaGhiNhan: Math.round(tienDaGhiNhan * 100) / 100,
    tienTheoAward: thieuAward.length > 0 ? null : Math.round(tienAward * 100) / 100,
    tienTheoThoaThuan: thieuThoaThuan ? null : Math.round(tienThoaThuan * 100) / 100,
    thieuAward,
  };
}

/** Ca sắp tới gần nhất tính từ hôm nay, dùng cho thẻ ở Trang chủ */
export function caSapToi(kho: Kho): CaLam | null {
  const homNay = ngayISO(new Date());
  return (
    kho.caLam
      .filter((c) => !c.daLam && c.ngay >= homNay)
      .sort((a, b) => (a.ngay + a.batDau).localeCompare(b.ngay + b.batDau))[0] ?? null
  );
}

export function timCongViec(kho: Kho, id: string): CongViec | undefined {
  return kho.congViec.find((c) => c.id === id);
}

/* ==================== Các lựa chọn cho form ==================== */

export const NGHI_PHUT = [
  { value: 0, label: "Không nghỉ" },
  { value: 15, label: "15 phút" },
  { value: 30, label: "30 phút" },
  { value: 45, label: "45 phút" },
  { value: 60, label: "1 tiếng" },
];

export const TRANG_THAI_TRA = [
  { value: "chua_ghi_nhan", label: "Chưa ghi nhận" },
  { value: "da_nhan", label: "Đã nhận tiền" },
  { value: "chua_nhan", label: "Chưa được trả" },
];

export const HINH_THUC_NHAN = [
  { value: "", label: "Chọn hình thức" },
  { value: "chuyen_khoan", label: "Chuyển khoản" },
  { value: "tien_mat", label: "Tiền mặt" },
  { value: "ca_hai", label: "Vừa chuyển khoản vừa tiền mặt" },
];

export const CO_PAYSLIP = [
  { value: "chua_ro", label: "Chưa rõ" },
  { value: "co", label: "Có nhận payslip" },
  { value: "khong", label: "Không có payslip" },
];
