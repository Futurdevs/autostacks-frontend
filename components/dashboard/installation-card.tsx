"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, ExternalLink, Loader2, MoreHorizontal, RefreshCw, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GitHubInstallation } from "@/lib/github";

interface InstallationCardProps {
  installation: GitHubInstallation;
}

export function InstallationCard({ installation }: InstallationCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleViewRepositories = () => {
    // Set loading state and navigate to repositories page
    setIsLoading(true);
    window.location.href = `/dashboard/installations/${installation.installation_id}/repositories`;
  };

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur-sm hover:shadow-neon-purple transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            {installation.account_avatar_url ? (
              <Image
                src={installation.account_avatar_url}
                alt={installation.account_name}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-lg font-bold">{installation.account_name.charAt(0)}</span>
              </div>
            )}
            <div>
              <CardTitle className="text-lg">{installation.account_name}</CardTitle>
              <CardDescription>{installation.account_type}</CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={handleViewRepositories}>
                View repositories
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={installation.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  <span>Open in GitHub</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Remove installation</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground flex items-center gap-1 mb-4">
          <Calendar className="h-3.5 w-3.5" />
          <span>Installed {formatDistanceToNow(new Date(installation.created_at))} ago</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${installation.is_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm">{installation.is_active ? 'Active' : 'Inactive'}</span>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button 
          onClick={handleViewRepositories} 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              View Repositories
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
} 