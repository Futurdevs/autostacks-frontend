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
import { FormProvider, useForm } from 'react-hook-form';
import { Form, FormField, FormItem } from '@/components/ui/form';
import { z } from 'zod';
import { InputChat } from '@/types/chat';
import { zodResolver } from '@hookform/resolvers/zod';

const FormSchema = z.object({
  inputChat: z.string({required_error: "The input field can't be empty"}).min(2, {message: "Chat can't be less than 2"}),
})

export default function Page(): JSX.Element {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const form = useForm<InputChat>({
    defaultValues: {
      inputChat: '',
    },
    resolver: zodResolver(FormSchema),
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <section className="h-screen flex gap-10">
      <SidebarProvider className='h-screen w-60 flex'>
          <SidebarTrigger className={`hover:bg-purple-600 w-7 ${isSidebarOpen ? 'ml-64 z-50' : 'ml-10 mt-4'}`} onClick={toggleSidebar} />
          {isSidebarOpen && (
            <Sidebar className="h-full w-60 overflow-auto">
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
      </SidebarProvider>

      <div className='flex-1 h-full'>
        <FormProvider {...form}>
          <Form {...form}>
            <FormField control={form.control} name='inputChat' render={({field}) => (
              <FormItem {...field} />
            )} />
          </Form>
        </FormProvider>
      </div>
    </section>
  );
}