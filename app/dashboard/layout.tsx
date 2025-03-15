"use client";

import { Loader2 } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/header";
import { ToastProvider } from "@/components/toast-provider";
import { useCurrentUser } from "@/hooks/auth";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login in the useEffect
  }

  return (
    <div className="h-screen bg-background relative">
      <DashboardHeader user={user} />
      <main className="container mx-auto py-6 px-4">
        {children}
      </main>
      <ToastProvider />
    </div>
  );
} 