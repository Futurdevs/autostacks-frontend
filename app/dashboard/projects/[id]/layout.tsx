import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Dashboard - AutoStacks",
  description: "View and manage your Stacks blockchain project",
}; 

export default function ProjectLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      {children}
    </div>
  );
} 