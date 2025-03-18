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
  Share2,
  Trash2,
  AlertTriangle
} from "lucide-react";
import { conversationService } from "@/lib/conversation";
import { projectService, Project } from "@/lib/projects";
import { showToast } from "@/lib/toast";

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const [projectName, setProjectName] = useState("Your Project");
  const [projectDescription, setProjectDescription] = useState<string | null>(null);
  const [projectFeatures, setProjectFeatures] = useState<string[]>([]);
  const [projectStatus, setProjectStatus] = useState<string>("pending");
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  // We keep the full project object for potential future use
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [project, setProject] = useState<Project | null>(null);
  
  // State for delete confirmation modal
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      // If no ID provided, redirect to projects page
      if (!params.id) {
        router.push("/dashboard/projects");
        return;
      }

      setLoading(true);
      
      try {
        // First try to fetch the project directly using the ID
        const projectData = await projectService.getProject(params.id as string);
        
        if (projectData) {
          setProject(projectData);
          setProjectName(projectData.name);
          setProjectDescription(projectData.description || null);
          setProjectStatus(projectData.status || "pending");
          
          // In the future, project features might come from the API
          // For now, we'll set some placeholder features based on the project name
          setProjectFeatures([
            `Stacks blockchain integration for ${projectData.name}`,
            "Smart contract deployment automation",
            "GitHub repository management",
            "Continuous integration and deployment"
          ]);
          
          setLoading(false);
          return;
        }
      } catch (error) {
        // If the project fetch fails (e.g., 404), don't show an error yet
        // We'll try the conversation approach as a fallback
        console.log("Project not found by ID, trying conversation fallback:", error);
      }

      // Fallback: Try to get the project name from the conversation
      try {
        const messages = await conversationService.getConversationMessages(params.id as string);
        
        // Find the first user message and use it as a project name
        for (const message of messages) {
          if (message.role === "user" && message.content) {
            // Extract potential project name from the first message
            const content = message.content;
            const nameMatch = content.match(/project called ["'](.+?)["']/i);
            if (nameMatch && nameMatch[1]) {
              setProjectName(nameMatch[1]);
              
              // Set placeholder features based on the extracted name
              setProjectFeatures([
                `Stacks blockchain integration for ${nameMatch[1]}`,
                "Smart contract deployment automation",
                "GitHub repository management",
                "Continuous integration and deployment"
              ]);
              
              break;
            } else if (content.length < 50) {
              // If message is short, just use it directly
              setProjectName(content);
              
              // Set placeholder features
              setProjectFeatures([
                "Stacks blockchain integration",
                "Smart contract deployment automation",
                "GitHub repository management",
                "Continuous integration and deployment"
              ]);
              
              break;
            }
          }
        }
        
        setLoading(false);
      } catch (convError) {
        console.error("Error fetching project or conversation:", convError);
        setHasError(true);
        setLoading(false);
        showToast.error("Could not find the requested project", "project-error");
        
        // Redirect to projects list after a delay
        setTimeout(() => {
          router.push("/dashboard/projects");
        }, 2000);
      }
    };

    fetchProject();
  }, [params.id, router]);

  // Handle project deletion
  const handleDeleteProject = async () => {
    if (!params.id) return;
    
    try {
      setIsDeleting(true);
      await projectService.deleteProject(params.id as string);
      showToast.success("Project deleted successfully", "project-delete");
      router.push("/dashboard/projects");
    } catch (error) {
      console.error("Error deleting project:", error);
      showToast.error("Failed to delete project. Please try again.", "project-delete");
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // If there's an error loading the project, show a brief error message before redirecting
  if (hasError) {
    return (
      <div className="container max-w-5xl mx-auto py-8">
        <div className="bg-destructive/10 text-destructive rounded-md p-4 mb-6 flex items-start gap-2">
          <p>Project not found. Redirecting to projects list...</p>
        </div>
      </div>
    );
  }

  // Get appropriate status badge color and text
  const getStatusInfo = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return { color: 'bg-green-500/20 text-green-600', text: 'Active' };
      case 'completed':
        return { color: 'bg-blue-500/20 text-blue-600', text: 'Completed' };
      case 'failed':
        return { color: 'bg-red-500/20 text-red-600', text: 'Failed' };
      case 'building':
        return { color: 'bg-orange-500/20 text-orange-600', text: 'Building' };
      case 'deploying':
        return { color: 'bg-indigo-500/20 text-indigo-600', text: 'Deploying' };
      default:
        return { color: 'bg-primary/20 text-primary', text: 'Pending' };
    }
  };

  const statusInfo = getStatusInfo(projectStatus);

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
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">{loading ? "Loading..." : projectName}</h1>
          <p className="text-muted-foreground">Project Details</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1 rounded-full flex items-center gap-1 ${statusInfo.color}`}>
            <span className="text-sm font-semibold">{statusInfo.text}</span>
          </div>
          <div className="bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-1">
            <Sparkles size={16} />
            <span className="text-sm font-semibold">BETA</span>
          </div>
          <Button 
            variant="destructive" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={loading || isDeleting}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-md w-full p-6 shadow-lg">
            <div className="flex items-center gap-2 text-destructive mb-4">
              <AlertTriangle className="h-6 w-6" />
              <h2 className="text-xl font-bold">Delete Project</h2>
            </div>
            <p className="mb-6">
              Are you sure you want to delete <span className="font-bold">{projectName}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteProject}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Project"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {!loading && projectDescription && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{projectDescription}</p>
          </CardContent>
        </Card>
      )}

      {!loading && projectFeatures.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Project Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              {projectFeatures.map((feature, index) => (
                <li key={index} className="text-muted-foreground">{feature}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card className="w-full mb-8 border-2 border-dashed border-primary/20 bg-primary/5 overflow-hidden relative">
        <div className="absolute -right-12 -top-12 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
        
        <CardHeader className="text-center pb-0">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-3">
            <RocketIcon className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Project Processing</CardTitle>
          <CardDescription className="text-base">
            We&apos;re building your project and preparing the GitHub repository
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6 text-center">
          <p className="max-w-md mx-auto mb-8">
            Your project has been created and is now being processed. We&apos;re setting up the necessary infrastructure, generating code, and preparing your GitHub repository.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="bg-background rounded-lg p-4 text-center">
              <Construction className="h-8 w-8 mx-auto mb-2 text-orange-500" />
              <h3 className="font-medium mb-1">Building</h3>
              <p className="text-sm text-muted-foreground">Generating project files</p>
            </div>
            
            <div className="bg-background rounded-lg p-4 text-center">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <h3 className="font-medium mb-1">Deployment</h3>
              <p className="text-sm text-muted-foreground">Preparing GitHub repo</p>
            </div>
            
            <div className="bg-background rounded-lg p-4 text-center">
              <Share2 className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <h3 className="font-medium mb-1">Notification</h3>
              <p className="text-sm text-muted-foreground">You&apos;ll be notified when ready</p>
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