"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputChat } from "@/types/chat";
import { zodResolver } from "@hookform/resolvers/zod";
import { BaseSyntheticEvent, useState } from "react";
import { Form, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { FaBrain, FaPlus } from "react-icons/fa";
import { z } from "zod";

const FormSchema = z.object({
  inputChat: z
    .string({ required_error: "Input field can't be empty" })
    .min(2, { message: "Chat can't be less than 2" }),
});

export default function Page() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [messages, setMessages] = useState([{ chat: "", user: "" }]);

  const form = useForm<InputChat>({
    defaultValues: {
      inputChat: "",
    },
    resolver: zodResolver(FormSchema),
  });

  const onSubmit: SubmitHandler<InputChat> = async (data: InputChat) => {
    setMessages([...messages, { chat: "AI Response", user: data.inputChat }]);
    form.reset();
  };

  return (
    <section>
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Projects Section</h1>
          <Button
            className="shadow-neon-purple"
            onClick={() => setShowModal(true)}
          >
            <FaPlus /> Create a new project
          </Button>
        </div>

        <p className="mt-10 text-xl">There is currently no available project</p>
      </div>

      {showModal && (
        <figure className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-40 backdrop-blur-lg p-4 text-white shadow-lg h-full w-full z-50 flex items-center justify-center">
          <section className="z-50 bg-gray-800 w-3/4 h-3/4 rounded-2xl px-6 py-4 relative">
            <nav className="border border-gray-600 p-4 rounded-lg">
              <h2 className="font-normal text-white text-xl flex items-center gap-2">
                <FaBrain className="text-purple-500" size={28} />{" "}
                <span>Ask AI</span>
                <Badge color="purple">Beta</Badge>
              </h2>
            </nav>

            <div className="chat-container overflow-y-auto h-3/4 p-4">
              {messages
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
              <Form
                className="absolute bottom-4 left-1/2 -translate-x-1/2 w-11/12"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="inputChat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel></FormLabel>
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
              </Form>
            </FormProvider>
          </section>
        </figure>
      )}
    </section>
  );
}
