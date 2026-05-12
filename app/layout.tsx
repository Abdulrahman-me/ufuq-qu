import type { Metadata } from "next";
import "./globals.css";
import dynamic from "next/dynamic";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import AppNavbar from "@/components/AppNavbar";
import { TooltipProvider } from "@/components/ui/tooltip";

const AnimatedBackground = dynamic(
  () => import("@/components/AnimatedBackground").then((m) => m.AnimatedBackground),
  { ssr: false },
);

export const metadata: Metadata = {
  title: "أفق | منصة الجاهزية الأكاديمية",
  description: "منصة أفق للتعلم التكيفي والاستعداد للاختبار الوطني",
  icons: {
    icon: "/horizon-favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&family=Noto+Sans+Arabic:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <TooltipProvider delayDuration={0}>
            <AnimatedBackground />
            <div className="relative flex min-h-screen flex-col">
              <AppNavbar />
              <main className="min-w-0 flex-1 min-h-screen">{children}</main>
            </div>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
