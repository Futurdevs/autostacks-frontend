"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Search, ExternalLink, Code, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { showToast } from "@/lib/toast";
import { GitHubService, type GitHubInstallation, type GitHubRepository } from "@/lib/github";
import { DashboardHeader } from "@/components/dashboard/header";
import { getAuthStatus } from "@/lib/server/server-auth";
import { useDebounce } from "use-debounce";

interface RepositoriesPageProps {
  params: {
    installationId: string;
  };
}

export default function RepositoriesPage({ params }: RepositoriesPageProps) {
  const router = useRouter();
  const [user, setUser] = useState<{ full_name?: string; email: string } | null>(null);
  const [installation, setInstallation] = useState<GitHubInstallation | null>(null);
  const [filteredRepositories, setFilteredRepositories] = useState<GitHubRepository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    per_page: 12
  });

  const installationId = parseInt(params.installationId, 10);

  const loadRepositories = useCallback(async (id: number, page: number = 1, search?: string) => {
    try {
      const filter = {
        page,
        per_page: pagination.per_page,
        search: search || undefined
      };
      
      const paginatedData = await GitHubService.getInstallationRepositories(id, filter);
      
      setFilteredRepositories(paginatedData.items);
      setPagination({
        total: paginatedData.total,
        page: paginatedData.page,
        per_page: paginatedData.per_page
      });
    } catch (error) {
      console.error("Error fetching repositories:", error);
      showToast.error("Failed to load repositories.", "repositories-toast");
    } finally {
      setIsLoading(false);
    }
  }, [pagination.per_page]);

  const loadInstallation = useCallback(async () => {
    setIsLoading(true);
    try {
      const installationData = await GitHubService.getInstallation(installationId);
      setInstallation(installationData);
      loadRepositories(installationId, pagination.page, debouncedSearchQuery);
    } catch (error) {
      console.error("Error fetching installation:", error);
      showToast.error("Failed to load GitHub installation.", "installation-toast");
      router.push("/dashboard");
    }
  }, [installationId, router, loadRepositories, pagination.page, debouncedSearchQuery]);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Get auth status from server
        const { isAuthenticated, user: userData } = await getAuthStatus();

        if (!isAuthenticated || !userData) {
          router.push("/login");
          return;
        }

        setUser(userData);
        loadInstallation();
      } catch (error) {
        console.error("Error fetching user data:", error);
        showToast.error("Failed to load user data. Please try again.", "user-data-toast");
      }
    };

    loadUserData();
  }, [router, installationId, loadInstallation]);

  // Effect to handle debounced search
  useEffect(() => {
    if (installation) {
      setPagination(prev => ({ ...prev, page: 1 }));
      loadRepositories(installationId, 1, debouncedSearchQuery);
    }
  }, [debouncedSearchQuery, installationId, loadRepositories, installation]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    // The actual search is now handled by the useEffect with the debounced value
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > Math.ceil(pagination.total / pagination.per_page)) {
      return;
    }
    
    setPagination(prev => ({ ...prev, page: newPage }));
    loadRepositories(installationId, newPage, debouncedSearchQuery);
  };

  if (!user || !installation) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} />
      
      <main className="container mx-auto py-6 px-4">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="mb-4 pl-0 hover:bg-transparent"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <h1 className="text-3xl font-bold tracking-tight glow">
            {installation.account_name}&apos;s Repositories
          </h1>
          <p className="text-muted-foreground mt-2">
            Browse and select repositories to build Stacks blockchain projects.
          </p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search repositories..."
              className="pl-10 border-primary/30 focus:border-primary"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredRepositories.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRepositories.map((repo) => (
                <Card 
                  key={repo.id} 
                  className="border-primary/20 bg-card/50 backdrop-blur-sm hover:shadow-neon-purple transition-shadow duration-300"
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{repo.name}</CardTitle>
                        <CardDescription className="line-clamp-1">
                          {repo.description || "No description available"}
                        </CardDescription>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        asChild
                      >
                        <Link href={repo.html_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">Open in GitHub</span>
                        </Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className={`w-2 h-2 rounded-full ${repo.private ? 'bg-amber-500' : 'bg-green-500'}`}></div>
                      <span>{repo.private ? 'Private' : 'Public'}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button 
                      className="w-full"
                      onClick={() => router.push(`/dashboard/projects/new?repo=${repo.repository_id}`)}
                    >
                      <Code className="mr-2 h-4 w-4" />
                      Create Project
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            {/* Pagination Controls */}
            {pagination.total > pagination.per_page && (
              <div className="flex justify-center items-center mt-8 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="text-sm">
                  Page {pagination.page} of {Math.ceil(pagination.total / pagination.per_page)}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= Math.ceil(pagination.total / pagination.per_page)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">No Repositories Found</CardTitle>
              <CardDescription>
                {searchQuery ? "No repositories match your search criteria." : "This installation has no repositories."}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <Code className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground max-w-md">
                {searchQuery 
                  ? "Try a different search term or clear the search to see all repositories."
                  : "Add repositories to this installation or select a different installation."}
              </p>
            </CardContent>
            {searchQuery && (
              <CardFooter className="flex justify-center">
                <Button 
                  onClick={() => {
                    setSearchQuery("");
                  }}
                  variant="outline"
                >
                  Clear Search
                </Button>
              </CardFooter>
            )}
          </Card>
        )}
      </main>
    </div>
  );
} 