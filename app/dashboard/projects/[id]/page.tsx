"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  RocketIcon, 
  ArrowLeft, 
  Construction, 
  Sparkles, 
  Calendar, 
  Share2 
} from "lucide-react";
import { conversationService } from "@/lib/conversation";

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const [projectName, setProjectName] = useState("Your Project");
  const [loading, setLoading] = useState(true);

  // Try to get the project name from the conversation title
  useEffect(() => {
    const fetchConversation = async () => {
      try {
        if (params.id) {
          setLoading(true);
          const messages = await conversationService.getConversationMessages(params.id as string);
          
          // Find the first user message and use it as a project name, or use conversation title
          for (const message of messages) {
            if (message.role === "user" && message.content) {
              // Extract potential project name from the first message
              const content = message.content;
              const nameMatch = content.match(/project called ["'](.+?)["']/i);
              if (nameMatch && nameMatch[1]) {
                setProjectName(nameMatch[1]);
                break;
              } else if (content.length < 50) {
                // If message is short, just use it directly
                setProjectName(content);
                break;
              }
            }
          }
          
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching conversation:", error);
        setLoading(false);
      }
    };

    fetchConversation();
  }, [params.id]);

  return (
    <div className="container max-w-5xl mx-auto py-8">
      <Button
        variant="ghost"
        className="mb-6 group"
        onClick={() => router.push("/dashboard/projects")}
      >
        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Projects
      </Button>
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{loading ? "Loading..." : projectName}</h1>
          <p className="text-muted-foreground">Project Dashboard</p>
        </div>
        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-1">
          <Sparkles size={16} />
          <span className="text-sm font-semibold">BETA</span>
        </div>
      </div>

      <Card className="w-full mb-8 border-2 border-dashed border-primary/20 bg-primary/5 overflow-hidden relative">
        <div className="absolute -right-12 -top-12 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
        
        <CardHeader className="text-center pb-0">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-3">
            <RocketIcon className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Coming Soon</CardTitle>
          <CardDescription className="text-base">
            Project dashboard is under construction
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6 text-center">
          <p className="max-w-md mx-auto mb-8">
            We&apos;re working hard to bring you a complete project management experience. 
            Your project has been created and will be available soon with all features.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="bg-background rounded-lg p-4 text-center">
              <Construction className="h-8 w-8 mx-auto mb-2 text-orange-500" />
              <h3 className="font-medium mb-1">Development</h3>
              <p className="text-sm text-muted-foreground">Actively building</p>
            </div>
            
            <div className="bg-background rounded-lg p-4 text-center">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <h3 className="font-medium mb-1">Coming Soon</h3>
              <p className="text-sm text-muted-foreground">Est. Q2 2025</p>
            </div>
            
            <div className="bg-background rounded-lg p-4 text-center">
              <Share2 className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <h3 className="font-medium mb-1">Updates</h3>
              <p className="text-sm text-muted-foreground">Stay tuned</p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex-col space-y-3">
          <Button 
            className="w-full"
            onClick={() => router.push("/dashboard/projects/new")}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Create Another Project
          </Button>
          
          <Button 
            variant="outline"
            className="w-full"
            onClick={() => router.push("/dashboard")}
          >
            Return to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 