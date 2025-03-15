'use client'
import React, { useState } from "react";
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
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { z } from "zod";
import { InputChat } from "@/types/chat";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";

const FormSchema = z.object({
  inputChat: z
    .string({ required_error: "The input field can't be empty" })
    .min(2, { message: "Chat can't be less than 2" }),
});

export default function Page(): JSX.Element {
  const [chatHistory, setChatHistory] = useState([{ id: 1, title: "", timestamp: "", chats: [{ chat: "", user: "" }] }]);
  const [currentChatId, setCurrentChatId] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const form = useForm<InputChat>({
    defaultValues: {
      inputChat: "",
    },
    resolver: zodResolver(FormSchema),
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const onSubmit: SubmitHandler<InputChat> = async (data) => {
    if (data.inputChat.trim() !== "") {
      const currentDateTime = new Date().toLocaleString();
      setChatHistory((prevHistory) =>
        prevHistory.map((chat) =>
          chat.id === currentChatId
            ? {
                ...chat,
                title: chat.chats.length === 0 ? data.inputChat : chat.title,
                timestamp: chat.chats.length === 0 ? currentDateTime : chat.timestamp,
                chats: [...chat.chats, { chat: data.inputChat, user: "User" }],
              }
            : chat
        )
      );
    }
    form.reset();
  };

  const createNewChat = () => {
    const currentChat = chatHistory.find((chat) => chat.id === currentChatId);
    if (currentChat && currentChat.chats.length === 0) {
      alert("Current chat is empty. Please add a message before creating a new chat.");
      return;
    }
    const newChatId = chatHistory.length + 1;
    setChatHistory([...chatHistory, { id: newChatId, title: "", timestamp: "", chats: [] }]);
    setCurrentChatId(newChatId);
  };

  const switchChat = (id: number) => {
    setCurrentChatId(id);
  };

  const currentChat = chatHistory.find((chat) => chat.id === currentChatId)?.chats || [];

  return (
    <section className="h-screen flex gap-10">
      <SidebarProvider className="h-screen w-60 flex">
        <SidebarTrigger
          className={`hover:bg-purple-600 w-7 ${
            isSidebarOpen ? "ml-64 z-50" : "ml-10 mt-4"
          }`}
          onClick={toggleSidebar}
        />
        {isSidebarOpen && (
          <Sidebar className="h-full w-60 overflow-auto">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Chat History</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {chatHistory.map((chat) => (
                      <SidebarMenuItem key={chat.id}>
                        <SidebarMenuButton
                          asChild
                          className={`text-white ${currentChatId === chat.id ? "bg-purple-600" : ""}`}
                          onClick={() => switchChat(chat.id)}
                        >
                          <div>
                            <span>{chat.title || `Untitled...`}</span>
                            <br />
                            <span className="text-xs text-gray-400">{chat.timestamp}</span>
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        )}
      </SidebarProvider>

      <div className="flex-1 h-full relative">
        <div className="h-5/6 overflow-y-scroll py-10 px-16">
          {currentChat
            .filter((message) => message.chat.trim() !== "")
            .map((message, index) => (
              <div key={index} className="mb-4">
                <p className="self-start bg-gray-800 w-36 p-4 rounded-lg">
                  {message.chat}
                </p>
                <p className="self-end bg-gray-800 w-36 p-4 rounded-lg ml-auto">
                  {message.user}
                </p>
              </div>
            ))}
        </div>

        <FormProvider {...form}>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-11/12 flex items-center gap-2">
            <Button className="p-6" onClick={createNewChat}>
              <FaPlus />
            </Button>

            <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1">
              <FormField
                control={form.control}
                name="inputChat"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Tell me about your project"
                        className="bg-gray-800 border border-purple-400 p-6"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </div>
        </FormProvider>
      </div>
    </section>
  );
}