import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BRIDGE",
  description:
    "Ứng dụng giúp người lao động Việt Nam hiểu quyền lợi, kiểm tra công việc của mình và kết nối với tổ chức hỗ trợ lao động nhập cư tại Úc",

  /* Cho iPhone: khi "Thêm vào màn hình chính" thì mở toàn màn hình
     và hiện đúng tên BRIDGE dưới icon. Android đọc từ manifest.ts. */
  appleWebApp: {
    capable: true,
    title: "BRIDGE",
    statusBarStyle: "black-translucent",
  },

  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,

  /* Thanh trạng thái điện thoại đổi theo giao diện đang bật */
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f9fe" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1020" },
  ],

  viewportFit: "cover",
};

/**
 * Đoạn script này chạy TRƯỚC khi trình duyệt vẽ màn hình đầu tiên.
 * Không có nó thì mở app sẽ loé lên một nhịp nền tối rồi mới nhảy sang nền
 * sáng với người đã chọn giao diện sáng, nhìn rất lỗi.
 *
 * Viết bằng JavaScript thuần và bọc trong try vì localStorage có thể bị chặn
 * ở chế độ ẩn danh, hỏng chỗ này thì cả app trắng màn.
 */
const SCRIPT_GIAO_DIEN = `
try {
  var gd = localStorage.getItem('bridge_giao_dien') || 'toi';
  var html = document.documentElement;
  if (gd === 'sang') html.setAttribute('data-theme', 'light');
  else if (gd === 'toi') html.setAttribute('data-theme', 'dark');
  else if (window.matchMedia('(prefers-color-scheme: light)').matches)
    html.setAttribute('data-theme', 'light');
} catch (e) {}
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_GIAO_DIEN }} />
      </head>
      <body className="min-h-dvh bg-bg">
        {/* Artboard Figma là 375x812 (iPhone X).
            Khung này giữ app rộng tối đa 400px và nằm giữa màn hình, nên mở
            trên laptop lúc demo vẫn ra đúng dáng điện thoại. */}
        <div className="mx-auto flex min-h-dvh w-full max-w-[400px] flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
