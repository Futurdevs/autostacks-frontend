import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create New Project - AutoStacks",
  description: "Create a new Stacks blockchain project with AutoStacks",
}; 

export default function NewProjectLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="container mx-auto">
      {children}
    </div>
  );
} 