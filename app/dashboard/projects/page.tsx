"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Page() {
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <section className="min-h-screen">
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
          <section className="z-50 bg-white">
            Hello
          </section>
        </figure>
      )}
    </section>
  );
}
