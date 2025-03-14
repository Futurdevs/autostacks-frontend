"use client";

import { useEffect, useState } from "react";
import { Github, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { showToast } from "@/lib/toast";
import { GitHubService, type GitHubInstallation } from "@/lib/github";
import { InstallationCard } from "@/components/dashboard/installation-card";

export default function DashboardPage() {
  const [installations, setInstallations] = useState<GitHubInstallation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInstallLoading, setIsInstallLoading] = useState(false);

  useEffect(() => {
    loadInstallations();
  }, []);

  const loadInstallations = async () => {
    setIsLoading(true);
    try {
      const installationsData = await GitHubService.getInstallations();
      setInstallations(installationsData);
    } catch (error) {
      console.error("Error fetching installations:", error);
      showToast.error("Failed to load GitHub installations.", "installations-toast");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewInstallation = async () => {
    setIsInstallLoading(true);
    try {
      // Pass the current URL and any other useful state
      const state = {
        returnUrl: "/dashboard",
        timestamp: Date.now(),
        source: "dashboard"
      };
      const { installation_url } = await GitHubService.getNewInstallationUrl(state);
      // open in new tab
      window.open(installation_url, "_blank");
      setIsInstallLoading(false);
    } catch (error) {
      console.error("Error getting installation URL:", error);
      showToast.error("Failed to generate GitHub installation URL.", "installations-toast");
      setIsInstallLoading(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight glow">
          Welcome to your Dashboard!
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your Stacks blockchain projects and GitHub integrations.
        </p>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">GitHub Installations</h2>
          <Button 
            onClick={handleNewInstallation} 
            disabled={isInstallLoading}
            className="shadow-neon-purple"
          >
            {isInstallLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Installing...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Install GitHub App
              </>
            )}
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : installations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {installations.map((installation) => (
              <InstallationCard 
                key={installation.id} 
                installation={installation} 
              />
            ))}
          </div>
        ) : (
          <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">No GitHub Installations</CardTitle>
              <CardDescription>
                Install the GitHub App to connect your repositories.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Github className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground max-w-md">
                  Connect your GitHub account to start building Stacks blockchain projects with AutoStacks.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button 
                onClick={handleNewInstallation} 
                disabled={isInstallLoading}
                className="shadow-neon-purple"
              >
                {isInstallLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Installing...
                  </>
                ) : (
                  <>
                    <Github className="mr-2 h-4 w-4" />
                    Install GitHub App
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </>
  );
} 