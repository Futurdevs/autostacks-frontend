import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { ToastProvider } from "@/components/toast-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GitHub Integration - AutoStacks",
  description: "Connect your GitHub account to AutoStacks",
};

export default function GitHubLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          {children}
        </div>
        <ToastProvider />
      </body>
    </html>
  );
} 