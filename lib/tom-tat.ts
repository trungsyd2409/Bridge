/**
 * Dữ liệu và bộ sinh chữ cho màn "Bản tóm tắt gửi RMWC".
 *
 * Đề bài RMWC, phần Safe Referral Pathways, ghi nguyên văn:
 *   "With user consent, generate a structured summary with the main concern,
 *    dates, evidence, preferred language and assistance type requested."
 * Nên file này có đúng 5 phần đó, không thêm không bớt, cộng thêm phần lương
 * lấy từ màn Kiểm tra nếu người dùng vừa chạy kiểm tra.
 *
 * HAI NGUYÊN TẮC ĐÃ CÀI SẴN, đừng bỏ khi sửa:
 * 1. Không sinh chữ nào trước khi người dùng tự tay tick ô đồng ý.
 * 2. Bản tóm tắt chỉ nằm trên máy. App không gửi đi đâu. Người dùng bấm
 *    "Sao chép" rồi tự dán vào form của RMWC, hoặc đọc qua điện thoại.
 */

import { KetQua } from "@/lib/luong";
import { Kho, gioCuaCa } from "@/lib/cong-viec";

/* ==================== Kết quả kiểm tra gần nhất ====================
   Màn Kiểm tra lưu lại kết quả vào đây, màn Tóm tắt đọc ra để điền sẵn.
   Lưu riêng khỏi bridge_onboarding vì đây là dữ liệu về một công việc cụ thể,
   người dùng có thể muốn xoá riêng nó. */

export const KEY_KIEM_TRA = "bridge_kiem_tra_gan_nhat";

export type KiemTraDaLuu = {
  ketQua: KetQua;
  nganh: string;
  hinhThuc: string;
  viTri: string;
  gioMoiTuan: number | null;
  phieuLuong: string;
  hinhThucTra: string;
};

export function luuKiemTra(d: KiemTraDaLuu): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY_KIEM_TRA, JSON.stringify(d));
  } catch {
    /* localStorage bị chặn thì thôi, không làm app chết */
  }
}

export function docKiemTra(): KiemTraDaLuu | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY_KIEM_TRA);
    return raw ? (JSON.parse(raw) as KiemTraDaLuu) : null;
  } catch {
    return null;
  }
}

export function xoaKiemTra(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY_KIEM_TRA);
  } catch {
    /* bỏ qua */
  }
}

/* ==================== Các lựa chọn trong form ====================
   Mỗi lựa chọn có nhãn tiếng Việt cho người dùng đọc, và nhãn tiếng Anh
   để in ra bản tóm tắt tiếng Anh. Cán bộ RMWC không phải ai cũng đọc được
   tiếng Việt, nên bản tóm tắt xuất ra được cả hai thứ tiếng. */

export type LuaChonHaiNgu = { value: string; vi: string; en: string };

/** Vấn đề chính. Chọn được nhiều vì thực tế các vấn đề thường đi kèm nhau. */
export const VAN_DE: LuaChonHaiNgu[] = [
  { value: "tra_thieu", vi: "Tôi nghĩ mình bị trả lương thấp hơn quy định", en: "I believe I am being paid below the lawful rate" },
  { value: "khong_payslip", vi: "Tôi không được nhận phiếu lương (payslip)", en: "I do not receive payslips" },
  { value: "khong_phu_cap", vi: "Làm cuối tuần, ngày lễ, tăng ca nhưng không được trả thêm", en: "No penalty rates or overtime for weekends, public holidays or extra hours" },
  { value: "bi_tru_luong", vi: "Bị trừ lương mà không rõ lý do", en: "Money deducted from my pay without a clear reason" },
  { value: "gio_khong_dung", vi: "Số giờ tôi làm không được ghi nhận đúng", en: "My hours worked are not recorded correctly" },
  { value: "thu_viec", vi: "Phải làm thử việc nhiều ngày mà không được trả lương", en: "Unpaid trial work over several days" },
  { value: "de_doa_visa", vi: "Bị nhắc đến visa theo cách làm tôi lo sợ", en: "Visa status raised in a way that made me afraid" },
  { value: "an_toan", vi: "Nơi làm việc không an toàn", en: "The workplace is not safe" },
  { value: "cho_nghi", vi: "Bị cho nghỉ việc mà không rõ lý do", en: "Dismissed without a clear reason" },
];

/** Minh chứng đang có. Đây là phần cán bộ RMWC cần nhất khi phân loại ca. */
export const MINH_CHUNG: LuaChonHaiNgu[] = [
  { value: "tin_nhan", vi: "Tin nhắn trao đổi với chủ", en: "Messages with the employer" },
  { value: "payslip", vi: "Phiếu lương đã nhận", en: "Payslips received" },
  { value: "lich_ca", vi: "Lịch làm việc, bảng phân ca", en: "Rosters or shift schedules" },
  { value: "tu_ghi", vi: "Ghi chép giờ làm tôi tự ghi", en: "My own record of hours worked" },
  { value: "sao_ke", vi: "Sao kê ngân hàng", en: "Bank statements" },
  { value: "anh", vi: "Ảnh hoặc video tại nơi làm việc", en: "Photos or video from the workplace" },
  { value: "nguoi_lam_cung", vi: "Người làm cùng có thể xác nhận", en: "Co-workers who can confirm" },
  { value: "hop_dong", vi: "Hợp đồng hoặc thư nhận việc", en: "Contract or letter of offer" },
  { value: "chua_co", vi: "Hiện tôi chưa có gì", en: "I do not have any records yet" },
];

/** Ngôn ngữ muốn dùng khi RMWC liên hệ lại. */
export const NGON_NGU: LuaChonHaiNgu[] = [
  { value: "viet", vi: "Tiếng Việt", en: "Vietnamese" },
  { value: "viet_phien_dich", vi: "Tiếng Việt, qua phiên dịch TIS 131 450", en: "Vietnamese via TIS interpreter (131 450)" },
  { value: "anh", vi: "Tiếng Anh", en: "English" },
  { value: "ca_hai", vi: "Tiếng nào cũng được", en: "Either language is fine" },
];

/** Loại hỗ trợ mong muốn. Mục đầu quan trọng nhất: cho phép người dùng nói
    "tôi chỉ muốn hỏi cho rõ" thay vì bị đẩy thẳng vào việc nộp khiếu nại. */
export const LOAI_HO_TRO: LuaChonHaiNgu[] = [
  { value: "hoi_cho_ro", vi: "Tôi chỉ muốn hỏi cho rõ, chưa muốn làm gì thêm", en: "I only want information for now, no further action yet" },
  { value: "doc_giup", vi: "Muốn có người đọc giúp hợp đồng hoặc phiếu lương của tôi", en: "I would like someone to look over my contract or payslips" },
  { value: "doi_luong", vi: "Muốn được hỗ trợ để lấy lại phần lương còn thiếu", en: "I would like help recovering unpaid wages" },
  { value: "noi_tieng_viet", vi: "Muốn nói chuyện với người nói tiếng Việt trước đã", en: "I would like to speak with a Vietnamese speaker first" },
  { value: "chua_biet", vi: "Tôi chưa biết, mong được tư vấn", en: "I am not sure, I would like advice" },
];

/** Còn đang làm ở đó không. */
export const CON_LAM = [
  { value: "con", vi: "Tôi vẫn đang làm ở đó", en: "I am still working there" },
  { value: "nghi_roi", vi: "Tôi đã nghỉ", en: "I have left the job" },
];

/* ==================== Dữ liệu form ==================== */

export type DuLieuTomTat = {
  vanDe: string[];
  vanDeThem: string;
  batDauLam: string;
  vanDeTuKhiNao: string;
  conLam: string;
  minhChung: string[];
  ngonNgu: string;
  loaiHoTro: string;
  lienHeLai: string;
  guiKemVisa: boolean;
  /** Gửi kèm bảng ghi chép ca làm người dùng tự ghi trong app */
  guiKemGhiChep: boolean;
};

export const TOM_TAT_RONG: DuLieuTomTat = {
  vanDe: [],
  vanDeThem: "",
  batDauLam: "",
  vanDeTuKhiNao: "",
  conLam: "",
  minhChung: [],
  ngonNgu: "viet",
  loaiHoTro: "",
  lienHeLai: "",
  guiKemVisa: false,
  guiKemGhiChep: true,
};

/* ==================== Tóm lược ghi chép ca làm ====================
   Đây là phần có sức nặng nhất với cán bộ tiếp nhận: một bảng ghi chép có ngày,
   có giờ, có tình trạng trả tiền, do chính người lao động ghi trong lúc đi làm. */

export type TomLuocGhiChep = {
  soCa: number;
  tuNgay: string;
  denNgay: string;
  tongGio: number;
  tienDaGhiNhan: number;
  soCaChuaTra: number;
  soCaKhongPayslip: number;
  soNoiLam: number;
};

export function tomLuocGhiChep(kho: Kho | null): TomLuocGhiChep | null {
  if (!kho) return null;
  const daLam = kho.caLam.filter((c) => c.daLam);
  if (daLam.length === 0) return null;

  const ngay = daLam.map((c) => c.ngay).sort();
  return {
    soCa: daLam.length,
    tuNgay: ngay[0],
    denNgay: ngay[ngay.length - 1],
    tongGio: Math.round(daLam.reduce((t, c) => t + gioCuaCa(c), 0) * 100) / 100,
    tienDaGhiNhan:
      Math.round(
        daLam
          .filter((c) => c.thanhToan === "da_nhan" && c.soTien !== null)
          .reduce((t, c) => t + (c.soTien as number), 0) * 100
      ) / 100,
    soCaChuaTra: daLam.filter((c) => c.thanhToan === "chua_nhan").length,
    soCaKhongPayslip: daLam.filter((c) => c.payslip === "khong").length,
    soNoiLam: new Set(daLam.map((c) => c.congViecId)).size,
  };
}

/* ==================== Bộ sinh chữ ==================== */

function nhan(ds: LuaChonHaiNgu[], value: string, lang: "vi" | "en"): string {
  const o = ds.find((x) => x.value === value);
  return o ? o[lang] : "";
}

function nhieuNhan(ds: LuaChonHaiNgu[], values: string[], lang: "vi" | "en"): string[] {
  return values.map((v) => nhan(ds, v, lang)).filter(Boolean);
}

/** Nhãn ngành và hình thức làm việc bằng tiếng Anh, để in ra bản tiếng Anh. */
const NGANH_EN: Record<string, string> = {
  nha_hang: "Restaurant",
  fast_food: "Cafe, bakery or fast food",
  don_dep: "Cleaning",
  khach_san: "Hotel or bar",
  nail_toc: "Nail, hair and beauty",
  ban_le: "Retail",
  nong_nghiep: "Horticulture, fruit picking or packing",
  xay_dung: "Construction",
  kho_van: "Warehouse or delivery",
  cham_soc: "Aged or disability care",
  khac: "Other industry",
  khong_biet: "Not sure",
};

const HINH_THUC_EN: Record<string, string> = {
  casual: "Casual",
  part_time: "Part-time",
  full_time: "Full-time",
  hop_dong: "Contract",
  khong_ro: "Not sure",
};

export type ThongTinNguoiDung = {
  ten: string;
  visa: string;
  nganh: string;
  hinhThuc: string;
};

/**
 * Sinh bản tóm tắt dạng chữ thuần. Dùng chữ thuần chứ không phải PDF vì người
 * dùng cần dán được vào form liên hệ, vào email, hoặc gửi qua Zalo, Messenger.
 */
export function taoBanTomTat(
  d: DuLieuTomTat,
  nd: ThongTinNguoiDung,
  kt: KiemTraDaLuu | null,
  lang: "vi" | "en",
  kho: Kho | null = null
): string {
  const dong: string[] = [];
  const vi = lang === "vi";

  // Đánh số mục tự tăng, vì có mục chỉ xuất hiện khi người dùng có dữ liệu.
  // Đánh số cứng sẽ để lại khoảng trống kiểu "3. rồi 5." trông rất cẩu thả.
  let dem = 0;
  const so = () => `${++dem}. `;

  dong.push(vi ? "BẢN TÓM TẮT GỬI RMWC NSW" : "SUMMARY FOR RMWC NSW");
  dong.push(
    vi
      ? "Do người lao động tự tạo trong ứng dụng BRIDGE"
      : "Prepared by the worker in the BRIDGE app"
  );
  dong.push("");

  /* ---- 1. Vấn đề chính ---- */
  dong.push(so() + (vi ? "VẤN ĐỀ CHÍNH" : "MAIN CONCERN"));
  const dsVanDe = nhieuNhan(VAN_DE, d.vanDe, lang);
  if (dsVanDe.length === 0) {
    dong.push(vi ? "(chưa chọn)" : "(not selected)");
  } else {
    dsVanDe.forEach((v) => dong.push("- " + v));
  }
  if (d.vanDeThem.trim()) {
    dong.push((vi ? "Người lao động mô tả thêm: " : "In the worker's own words: ") + d.vanDeThem.trim());
  }
  dong.push("");

  /* ---- 2. Mốc thời gian ---- */
  dong.push(so() + (vi ? "MỐC THỜI GIAN" : "DATES"));
  if (d.batDauLam.trim())
    dong.push((vi ? "Bắt đầu làm: " : "Started work: ") + d.batDauLam.trim());
  if (d.vanDeTuKhiNao.trim())
    dong.push((vi ? "Vấn đề xuất hiện từ: " : "Concern began: ") + d.vanDeTuKhiNao.trim());
  if (d.conLam) {
    const c = CON_LAM.find((x) => x.value === d.conLam);
    if (c) dong.push((vi ? "Tình trạng hiện tại: " : "Current status: ") + c[lang]);
  }
  if (!d.batDauLam.trim() && !d.vanDeTuKhiNao.trim() && !d.conLam)
    dong.push(vi ? "(chưa điền)" : "(not provided)");
  dong.push("");

  /* ---- 3. Công việc ---- */
  dong.push(so() + (vi ? "CÔNG VIỆC" : "THE JOB"));
  const tenNganh = vi
    ? (kt?.nganh || nd.nganh
        ? NGANH_OPTIONS_VI[kt?.nganh || nd.nganh] ?? ""
        : "")
    : NGANH_EN[kt?.nganh || nd.nganh] ?? "";
  const tenHinhThuc = vi
    ? HINH_THUC_VI[kt?.hinhThuc || nd.hinhThuc] ?? ""
    : HINH_THUC_EN[kt?.hinhThuc || nd.hinhThuc] ?? "";
  if (tenNganh) dong.push((vi ? "Ngành: " : "Industry: ") + tenNganh);
  if (kt?.viTri?.trim()) dong.push((vi ? "Vị trí: " : "Role: ") + kt.viTri.trim());
  if (tenHinhThuc)
    dong.push((vi ? "Hình thức làm việc: " : "Employment type: ") + tenHinhThuc);
  if (kt?.gioMoiTuan)
    dong.push(
      vi
        ? `Số giờ mỗi tuần: khoảng ${kt.gioMoiTuan} giờ`
        : `Hours per week: about ${kt.gioMoiTuan}`
    );
  if (d.guiKemVisa && nd.visa)
    dong.push(
      (vi ? "Loại visa: " : "Visa subclass: ") + (VISA_GON[nd.visa] ?? nd.visa)
    );
  dong.push("");

  /* ---- 4. Kết quả đối chiếu lương ---- */
  if (kt && kt.ketQua.muc !== "thieu_thong_tin" && kt.ketQua.mucAward) {
    dong.push(so() + (vi ? "ĐỐI CHIẾU LƯƠNG TRONG ỨNG DỤNG" : "PAY COMPARISON MADE IN THE APP"));
    dong.push(
      vi
        ? `Bảng lương ngành đối chiếu: ${kt.ketQua.award}`
        : `Award used for comparison: ${kt.ketQua.award}`
    );
    dong.push(
      vi
        ? `Mức theo bảng lương ngành: $${kt.ketQua.mucAward.toFixed(2)} một giờ`
        : `Award rate: $${kt.ketQua.mucAward.toFixed(2)} per hour`
    );
    dong.push(
      vi
        ? `Mức người lao động cho biết đang nhận: $${kt.ketQua.mucDangNhan?.toFixed(2)} một giờ`
        : `Rate the worker reports receiving: $${kt.ketQua.mucDangNhan?.toFixed(2)} per hour`
    );
    if (kt.ketQua.chenhMoiGio) {
      dong.push(
        vi
          ? `Chênh lệch: khoảng $${kt.ketQua.chenhMoiGio.toFixed(2)} mỗi giờ` +
              (kt.ketQua.chenhMoiTuan
                ? `, khoảng $${kt.ketQua.chenhMoiTuan.toFixed(0)} một tuần`
                : "")
          : `Difference: about $${kt.ketQua.chenhMoiGio.toFixed(2)} per hour` +
              (kt.ketQua.chenhMoiTuan
                ? `, about $${kt.ketQua.chenhMoiTuan.toFixed(0)} per week`
                : "")
      );
    }
    dong.push(
      vi
        ? "Con số này do ứng dụng tính từ thông tin người lao động tự khai, dùng bảng lương lưu sẵn, cần được cán bộ kiểm tra lại."
        : "These figures were calculated by the app from self-reported information using a cached award snapshot, and should be verified by a caseworker."
    );
    dong.push("");
  }

  /* ---- Ghi chép ca làm người dùng tự ghi trong app ---- */
  const gc = d.guiKemGhiChep ? tomLuocGhiChep(kho) : null;
  if (gc) {
    dong.push(
      so() +
        (vi
          ? "GHI CHÉP CA LÀM DO NGƯỜI LAO ĐỘNG TỰ GHI"
          : "SHIFT RECORDS KEPT BY THE WORKER")
    );
    dong.push(
      vi
        ? `Số ca đã ghi: ${gc.soCa} ca tại ${gc.soNoiLam} nơi làm việc`
        : `Shifts recorded: ${gc.soCa} across ${gc.soNoiLam} workplace(s)`
    );
    dong.push(
      vi
        ? `Khoảng thời gian: từ ${gc.tuNgay} đến ${gc.denNgay}`
        : `Period covered: ${gc.tuNgay} to ${gc.denNgay}`
    );
    dong.push(
      vi
        ? `Tổng số giờ đã ghi: ${gc.tongGio} giờ`
        : `Total hours recorded: ${gc.tongGio}`
    );
    if (gc.tienDaGhiNhan > 0)
      dong.push(
        vi
          ? `Tổng tiền người lao động ghi nhận đã nhận: $${gc.tienDaGhiNhan.toFixed(2)}`
          : `Total pay the worker records as received: $${gc.tienDaGhiNhan.toFixed(2)}`
      );
    if (gc.soCaChuaTra > 0)
      dong.push(
        vi
          ? `Số ca người lao động cho biết chưa được trả: ${gc.soCaChuaTra}`
          : `Shifts the worker reports as unpaid: ${gc.soCaChuaTra}`
      );
    if (gc.soCaKhongPayslip > 0)
      dong.push(
        vi
          ? `Số ca không có phiếu lương: ${gc.soCaKhongPayslip}`
          : `Shifts with no payslip issued: ${gc.soCaKhongPayslip}`
      );
    dong.push(
      vi
        ? "Ghi chép này do người lao động tự nhập trong ứng dụng, chưa được đối chiếu với hồ sơ của chủ."
        : "These records were entered by the worker in the app and have not been checked against the employer's records."
    );
    dong.push("");
  }

  /* ---- Minh chứng ---- */
  dong.push(so() + (vi ? "MINH CHỨNG NGƯỜI LAO ĐỘNG ĐANG CÓ" : "EVIDENCE THE WORKER HAS"));
  const dsMinhChung = nhieuNhan(MINH_CHUNG, d.minhChung, lang);
  if (dsMinhChung.length === 0) {
    dong.push(vi ? "(chưa chọn)" : "(not selected)");
  } else {
    dsMinhChung.forEach((v) => dong.push("- " + v));
  }
  dong.push("");

  /* ---- 6. Ngôn ngữ ---- */
  dong.push(so() + (vi ? "NGÔN NGỮ MUỐN DÙNG" : "PREFERRED LANGUAGE"));
  dong.push(nhan(NGON_NGU, d.ngonNgu, lang) || (vi ? "(chưa chọn)" : "(not selected)"));
  dong.push("");

  /* ---- 7. Loại hỗ trợ ---- */
  dong.push(so() + (vi ? "LOẠI HỖ TRỢ MONG MUỐN" : "ASSISTANCE REQUESTED"));
  dong.push(nhan(LOAI_HO_TRO, d.loaiHoTro, lang) || (vi ? "(chưa chọn)" : "(not selected)"));
  dong.push("");

  /* ---- 8. Liên hệ ---- */
  dong.push(so() + (vi ? "CÁCH LIÊN HỆ LẠI" : "HOW TO GET IN TOUCH"));
  dong.push(
    d.lienHeLai.trim() ||
      (vi
        ? "Người lao động chọn không để lại thông tin liên hệ."
        : "The worker chose not to provide contact details.")
  );
  dong.push("");

  /* ---- Chân trang ---- */
  dong.push("---");
  dong.push(
    vi
      ? "Bản tóm tắt này do người lao động tự tạo và tự gửi. BRIDGE không lưu và không tự động gửi bất kỳ thông tin nào."
      : "This summary was created and sent by the worker. BRIDGE does not store or automatically transmit any of this information."
  );
  dong.push(
    vi
      ? "BRIDGE đưa thông tin, không đưa tư vấn pháp lý."
      : "BRIDGE provides information, not legal advice."
  );

  return dong.join("\n");
}

/* Nhãn tiếng Việt, viết gọn ở đây để bộ sinh chữ không phải import onboarding.ts
   (tránh vòng import và giữ file này chỉ làm một việc). */
const NGANH_OPTIONS_VI: Record<string, string> = {
  nha_hang: "Nhà hàng, quán ăn",
  fast_food: "Quán cà phê, tiệm bánh, đồ ăn nhanh",
  don_dep: "Dọn dẹp, vệ sinh",
  khach_san: "Khách sạn, quán bar",
  nail_toc: "Làm móng, làm tóc, làm đẹp",
  ban_le: "Bán lẻ, cửa hàng, siêu thị",
  nong_nghiep: "Nông nghiệp, hái quả, đóng gói",
  xay_dung: "Xây dựng",
  kho_van: "Kho bãi, giao hàng",
  cham_soc: "Chăm sóc người già, người khuyết tật",
  khac: "Ngành khác",
  khong_biet: "Chưa chắc chắn",
};

/** Visa in ra dạng ngắn, giống nhau ở cả hai bản ngôn ngữ. */
const VISA_GON: Record<string, string> = {
  "500": "Subclass 500 (student)",
  "462": "Subclass 462 (work and holiday)",
  "417": "Subclass 417 (working holiday)",
  "485": "Subclass 485 (temporary graduate)",
  "482": "Subclass 482 (skills in demand)",
  "300": "Subclass 300 (prospective marriage)",
  "189_190": "Subclass 189 or 190 (skilled)",
  khong_biet: "Người lao động không rõ mình giữ visa nào / worker is unsure",
};

const HINH_THUC_VI: Record<string, string> = {
  casual: "Thời vụ (Casual)",
  part_time: "Bán thời gian (Part-time)",
  full_time: "Toàn thời gian (Full-time)",
  hop_dong: "Hợp đồng",
  khong_ro: "Không rõ",
};
