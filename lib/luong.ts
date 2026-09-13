/**
 * Logic so sánh lương cho màn Kiểm tra công việc.
 *
 * QUY TẮC QUAN TRỌNG NHẤT: so với mức lương của AWARD (bảng lương ngành),
 * KHÔNG so với mức lương tối thiểu quốc gia. Bản prototype cũ so với lương
 * tối thiểu quốc gia nên báo "ổn" cho người thật ra đang bị trả thiếu.
 * Đó là lỗi tệ nhất app này có thể mắc.
 *
 * Số liệu dưới đây là bảng CACHE SẴN cho 3 award trong phạm vi MVP.
 * Bản chạy thật sẽ lấy từ Modern Awards Pay Database API của Fair Work
 * Commission. Dùng cache cho demo là quyết định có chủ đích, không phải
 * làm tắt — đã ghi trong README và trong proposal vòng 1.
 */

export type MucLuongAward = {
  award: string;
  /** Lương cơ bản mỗi giờ cho bậc phổ thông nhất của ngành */
  coBan: number;
  /** Lương casual mỗi giờ, đã gồm phụ cấp thời vụ 25% */
  casual: number;
};

/** Bảng lương cache sẵn, theo mã ngành trong lib/onboarding.ts */
export const BANG_LUONG: Record<string, MucLuongAward> = {
  nha_hang: { award: "Restaurant Industry Award", coBan: 24.1, casual: 30.13 },
  fast_food: { award: "Fast Food Industry Award", coBan: 24.04, casual: 30.05 },
  don_dep: { award: "Cleaning Services Award", coBan: 25.02, casual: 31.28 },
};

export type MucKetQua = "on" | "xem_lai" | "dang_lo" | "thieu_thong_tin";

export type KetQua = {
  muc: MucKetQua;
  tieuDe: string;
  award: string | null;
  mucAward: number | null;
  mucDangNhan: number | null;
  chenhMoiGio: number | null;
  chenhMoiTuan: number | null;
  /** Các dấu hiệu cần lưu ý, không phải kết luận vi phạm luật */
  dauHieu: string[];
};

export type ThongTinCongViec = {
  nganh: string;
  hinhThuc: string;
  luongMoiGio: number | null;
  gioMoiTuan: number | null;
  ngayLam: string[];
  hinhThucTra: string;
  phieuLuong: string;
};

/**
 * Tính kết quả. Không bao giờ kết luận "chủ vi phạm luật" — đó là legal advice,
 * nằm trong OUT OF SCOPE của đề bài. Chỉ nêu dấu hiệu và chuyển sang RMWC.
 */
export function danhGia(tt: ThongTinCongViec): KetQua {
  const bang = BANG_LUONG[tt.nganh];

  // Không biết ngành hoặc hình thức làm việc thì KHÔNG ĐOÁN.
  const thieu =
    !bang ||
    tt.hinhThuc === "khong_ro" ||
    tt.nganh === "khong_biet" ||
    tt.luongMoiGio === null;

  if (thieu) {
    return {
      muc: "thieu_thong_tin",
      tieuDe: "Chúng tôi cần biết thêm để so sánh chính xác",
      award: null,
      mucAward: null,
      mucDangNhan: tt.luongMoiGio,
      chenhMoiGio: null,
      chenhMoiTuan: null,
      dauHieu: [],
    };
  }

  // Casual được cộng phụ cấp thời vụ, nên mức đối chiếu cao hơn.
  const mucAward = tt.hinhThuc === "casual" ? bang.casual : bang.coBan;
  const luong = tt.luongMoiGio as number;
  const chenhMoiGio = Math.round((mucAward - luong) * 100) / 100;
  const gio = tt.gioMoiTuan ?? 0;
  const chenhMoiTuan = Math.round(chenhMoiGio * gio * 100) / 100;

  const dauHieu: string[] = [];
  if (tt.phieuLuong === "khong_bao_gio")
    dauHieu.push(
      "Bạn cho biết chưa từng nhận phiếu lương (payslip). Theo quy định, chủ phải đưa phiếu lương trong vòng 1 ngày làm việc sau khi trả lương."
    );
  if (tt.phieuLuong === "thinh_thoang")
    dauHieu.push(
      "Bạn chỉ thỉnh thoảng nhận được phiếu lương (payslip). Bạn có quyền nhận phiếu lương cho mọi kỳ trả lương."
    );
  if (tt.hinhThucTra === "tien_mat")
    dauHieu.push(
      "Nhận lương tiền mặt không sai luật, nhưng khiến bạn khó chứng minh mình đã làm bao nhiêu giờ nếu sau này cần."
    );
  if (tt.ngayLam.includes("cn") || tt.ngayLam.includes("t7"))
    dauHieu.push(
      "Bạn có làm cuối tuần. Làm thứ 7 và chủ nhật thường được trả cao hơn ngày thường theo bảng lương ngành."
    );

  let muc: MucKetQua;
  let tieuDe: string;
  if (chenhMoiGio <= 0.5) {
    muc = dauHieu.length >= 2 ? "xem_lai" : "on";
    tieuDe =
      muc === "on"
        ? "Công việc của bạn có vẻ đúng quy định"
        : "Có vài điểm bạn nên xem lại";
  } else if (chenhMoiGio < 3) {
    muc = "xem_lai";
    tieuDe = "Có vài điểm bạn nên xem lại";
  } else {
    muc = "dang_lo";
    tieuDe = "Công việc của bạn đang có dấu hiệu đáng lo";
  }

  return {
    muc,
    tieuDe,
    award: bang.award,
    mucAward,
    mucDangNhan: luong,
    chenhMoiGio: chenhMoiGio > 0 ? chenhMoiGio : 0,
    chenhMoiTuan: chenhMoiTuan > 0 ? chenhMoiTuan : 0,
    dauHieu,
  };
}

export const NGAY_TRONG_TUAN = [
  { value: "t2", label: "Thứ 2" },
  { value: "t3", label: "Thứ 3" },
  { value: "t4", label: "Thứ 4" },
  { value: "t5", label: "Thứ 5" },
  { value: "t6", label: "Thứ 6" },
  { value: "t7", label: "Thứ 7" },
  { value: "cn", label: "Chủ nhật" },
];

export const HINH_THUC_TRA = [
  { value: "chuyen_khoan", label: "Chuyển khoản" },
  { value: "tien_mat", label: "Tiền mặt" },
  { value: "ca_hai", label: "Vừa chuyển khoản vừa tiền mặt" },
];

export const PHIEU_LUONG = [
  { value: "deu_dan", label: "Có, đều đặn" },
  { value: "thinh_thoang", label: "Thỉnh thoảng" },
  { value: "khong_bao_gio", label: "Không bao giờ" },
];
