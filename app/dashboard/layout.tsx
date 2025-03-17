import { DashboardHeader } from "@/components/dashboard/header";
import { ToastProvider } from "@/components/toast-provider";
import { getAuthStatus } from "@/lib/server/server-auth";
import { LOGIN_PATH, PENDING_GITHUB_OAUTH_PATH } from "@/middlewares/config";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - AutoStacks",
  description: "Manage your Stacks blockchain projects and GitHub integrations",
}; 

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, isAuthenticated } = await getAuthStatus();

  if (!isAuthenticated) {
    redirect(LOGIN_PATH);
  }

  // if the user has no token or the token is expired & refresh token is expired
  if (!user?.github_oauth_token || (user?.github_oauth_token?.token_expired && user?.github_oauth_token?.refresh_token_expired)) {
    redirect(PENDING_GITHUB_OAUTH_PATH);
  }

  return (
    <div className="h-screen bg-background relative">
      <DashboardHeader user={user!} />
      <main className={`container mx-auto py-3 px-4`}>
        {children}
      </main>
      <ToastProvider />
    </div>
  );
} 