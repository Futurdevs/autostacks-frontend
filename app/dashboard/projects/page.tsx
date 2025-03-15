"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FaBrain } from "react-icons/fa";

export default function Page() {
  const [showModal, setShowModal] = useState<boolean>(false);

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
          <section className="z-50 bg-gray-800 w-3/4 h-3/4 rounded-2xl px-6 py-4">
            <nav className="border border-gray-600 p-4 rounded-lg">
              <h2 className="font-normal text-white text-xl flex items-center gap-2">
                <FaBrain className="inline-block text-purple-600" size={28} /> <span>Ask AI</span>
              </h2>
            </nav>
          </section>
        </figure>
      )}
    </section>
  );
}
