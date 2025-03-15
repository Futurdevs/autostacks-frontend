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
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Form, FormProvider, useForm } from "react-hook-form";
import { FaBrain } from "react-icons/fa";
import { z } from "zod";

const FormSchema = z.object({
  inputChat: z
    .string({ required_error: "Input field can't be empty" })
    .min(2, { message: "Chat can't be less than 2" }),
});

export default function Page() {
  const [showModal, setShowModal] = useState<boolean>(false);

  const form = useForm<InputChat>({
    defaultValues: {
      inputChat: "",
    },
    resolver: zodResolver(FormSchema),
  });

  return (
    <section>
      <div>
        <div className="flex items-center justify-between">
          <h1>Projects</h1>
          <Button
            className="shadow-neon-purple"
            onClick={() => setShowModal(true)}
          >
            Create a new project
          </Button>
        </div>

        <p>Here are the projects you are working on.</p>
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

            <FormProvider {...form}>
              <Form className="absolute bottom-4 left-1/2 -translate-x-1/2 w-11/12">
                <form>
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
                </form>
              </Form>
            </FormProvider>
          </section>
        </figure>
      )}
    </section>
  );
}
