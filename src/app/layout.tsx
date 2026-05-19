import type { Metadata } from "next";
import "./globals.css";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import Navbar from "@/components/ui/navbar";
import AuthProvider from "@/context/AuthProvider";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/ui/theme-provider";
const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "True Feedback",
  description: "True Feedback - Anonymous Feedback App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-[#121212]`}>
         <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
            {/* Global Ambient Left Orange Glow */}
            <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-[#EDAE48]/20 dark:bg-[#EDAE48]/15 blur-[120px] rounded-full" />
            
            {/* Global Ambient Right Crimson Glow */}
            <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-[#D1495B]/20 dark:bg-[#D1495B]/15 blur-[120px] rounded-full" />
          </div>
          
          <AuthProvider>  {/* ✅ body ke andar */}
            <Navbar/>
            {children}
            <Toaster richColors/>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}