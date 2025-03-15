'use client'
import React, { useState } from 'react';
import {
  SidebarContent,
  Sidebar,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function Page(): JSX.Element {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <section className="h-screen">
      <SidebarProvider>
        <main className='bg-white h-screen w-10 transform -translate-x-24 -translate-y-6'>
          <SidebarTrigger className={`fixed -mt-5 ${isSidebarOpen ? 'ml-72 mt-4' : 'ml-10 mt-4'}`} onClick={toggleSidebar} />
          {isSidebarOpen && (
            <Sidebar className="h-full overflow-auto mt-0">
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>Chat History</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild className="text-white">
                          Chat 1
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>Chat 2</SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>Chat 3</SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>Chat 4</SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>
          )}
        </main>
      </SidebarProvider>
    </section>
  );
}