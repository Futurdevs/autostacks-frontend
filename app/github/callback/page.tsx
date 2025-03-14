"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { GitHubService } from "@/lib/github";
import { showToast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function GitHubCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("");
  const [accountName, setAccountName] = useState<string>("");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get callback parameters from URL
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        const installationId = searchParams.get("installation_id");
        const setupAction = searchParams.get("setup_action");

        // Validate required parameters
        if (!code || !state || !installationId) {
          setMessage("Missing required callback parameters");
          setStatus("error");
          return;
        }

        // Process the callback
        const callbackParams = {
          code,
          state,
          installation_id: parseInt(installationId, 10),
          setup_action: setupAction
        };

        const response = await GitHubService.handleGitHubCallback(callbackParams);
        
        // Update state with success info
        setAccountName(response.account_name);
        setStatus("success");
        setMessage(`Successfully connected to ${response.account_name}'s GitHub account`);

        // Show success message
        showToast.success(
          `Successfully connected to ${response.account_name}'s GitHub account`,
          "github-callback-toast"
        );

        // Redirect after a short delay to show success message
        setTimeout(() => {
          // Redirect based on state or default to dashboard
          if (response.state && response.state.returnUrl) {
            router.push(response.state.returnUrl as string);
          } else {
            router.push("/dashboard");
          }
        }, 2000);
      } catch (error) {
        console.error("Error processing GitHub callback:", error);
        setMessage("Failed to process GitHub installation. Please try again.");
        setStatus("error");
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {status === "loading" && "Processing GitHub Installation"}
            {status === "success" && "Installation Successful"}
            {status === "error" && "Installation Failed"}
          </CardTitle>
          <CardDescription className="text-center">
            {status === "loading" && "Please wait while we connect your GitHub account..."}
            {status === "success" && `Connected to ${accountName}'s GitHub account`}
            {status === "error" && "There was a problem connecting your GitHub account"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          {status === "loading" && (
            <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
          )}
          {status === "success" && (
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
          )}
          {status === "error" && (
            <AlertCircle className="h-16 w-16 text-destructive mb-4" />
          )}
          <p className="text-center text-muted-foreground">
            {message}
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          {status === "error" && (
            <Button 
              onClick={() => router.push("/dashboard")}
              className="shadow-neon-purple"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Dashboard
            </Button>
          )}
          {status === "success" && (
            <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
} 