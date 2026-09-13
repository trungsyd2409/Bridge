import type { MetadataRoute } from "next";

/**
 * File này nằm ở app/manifest.ts — Next.js tự biến nó thành /manifest.webmanifest.
 * Có file này thì điện thoại cho phép "Thêm vào màn hình chính", và khi mở lên
 * app chạy toàn màn hình, không có thanh địa chỉ của trình duyệt.
 *
 * Vì sao quan trọng với BRIDGE: proposal vòng 1 đã cam kết app cài được từ
 * trình duyệt mà không cần lên kho ứng dụng, vì người dùng ngại có một app về
 * quyền lợi lao động hiện trong lịch sử tải của họ. Đây là chỗ biến lời hứa đó
 * thành thật.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BRIDGE — Quyền lợi lao động",
    short_name: "BRIDGE",
    description:
      "Ứng dụng giúp người lao động Việt Nam hiểu quyền lợi, kiểm tra công việc của mình và kết nối với tổ chức hỗ trợ lao động nhập cư tại Úc",
    lang: "vi",
    start_url: "/",
    display: "standalone", // mở toàn màn hình, không có thanh địa chỉ
    orientation: "portrait",
    background_color: "#f8f9fe", // màu nền lúc app đang mở
    theme_color: "#006ffd", // màu thanh trạng thái trên điện thoại
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable", // để Android bo tròn icon cho đẹp
      },
    ],
  };
}
