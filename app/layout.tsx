import type { Metadata } from "next";
import "./globals.css";
import dynamic from "next/dynamic";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import AppNavbar from "@/components/AppNavbar";
import { TooltipProvider } from "@/components/ui/tooltip";
import localFont from "next/font/local";

const ibmFont = localFont({
  src: [
    { path: "../fonts/IBM Plex Sans Arabic/IBMPlexSansArabic-Thin.ttf", weight: "100", style: "normal" },
    { path: "../fonts/IBM Plex Sans Arabic/IBMPlexSansArabic-ExtraLight.ttf", weight: "200", style: "normal" },
    { path: "../fonts/IBM Plex Sans Arabic/IBMPlexSansArabic-Light.ttf", weight: "300", style: "normal" },
    { path: "../fonts/IBM Plex Sans Arabic/IBMPlexSansArabic-Regular.ttf", weight: "400", style: "normal" },
    { path: "../fonts/IBM Plex Sans Arabic/IBMPlexSansArabic-Medium.ttf", weight: "500", style: "normal" },
    { path: "../fonts/IBM Plex Sans Arabic/IBMPlexSansArabic-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../fonts/IBM Plex Sans Arabic/IBMPlexSansArabic-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-ibm",
  display: "swap",
});

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
      </head>
      <body suppressHydrationWarning className={ibmFont.variable}>
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
