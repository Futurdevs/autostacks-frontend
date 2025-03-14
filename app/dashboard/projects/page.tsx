import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <section>
      <div>
        <div className="flex items-center justify-between">
          <h1>Projects</h1>
          <Button className="shadow-neon-purple">Create a new project</Button>
        </div>

        <p>Here are the projects you are working on.</p>
      </div>
    </section>
  )
}