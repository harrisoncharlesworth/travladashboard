import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";
import { NotificationSystem } from "@/components/notification-system";
import { ToastContainer } from "@/components/ui/toast";
import { OfflineIndicator } from "@/components/offline-indicator";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Travla Dashboard",
  description: "Real-time hotel management dashboard for leading indicators and insights",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background">
            <Navigation />
            <main className="max-w-screen-xl mx-auto px-4 md:px-6 py-6">
              {children}
            </main>
            <NotificationSystem />
            <ToastContainer />
            <OfflineIndicator />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
