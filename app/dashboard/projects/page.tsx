"use client";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";


export default function Page() {
  const router = useRouter();

  const handleCreateProject = () => {
    router.push("/dashboard/projects/new");
  };

  return (
    <section>
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Projects Section</h1>
          <Button
            className="shadow-neon-purple"
            onClick={handleCreateProject}
          >
            <FaPlus className="mr-2" /> Create a new project 
            <span className="ml-2 flex items-center gap-1 bg-primary/20 px-1.5 py-0.5 rounded-full text-xs">
              <Sparkles size={10} />
              BETA
            </span>
          </Button>
        </div>

        <p className="mt-10 text-xl">There is currently no available project</p>
      </div>
    </section>
  );
}
