"use client";

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AuthService from '@/lib/auth';
import { Github } from 'lucide-react';
import { showToast } from '@/lib/toast';
import { useCurrentUser } from '@/hooks/auth';
import { LOGIN_REDIRECT } from '@/middlewares/config';
import { useRouter } from 'next/navigation';


export default function PendingGithubOAuth() {
    const [isLoading, setIsLoading] = useState(false);
    const { user, isLoading: isUserLoading } = useCurrentUser();
    const router = useRouter();
    useEffect(() => {
        if (user && !isUserLoading) {
            if (user.github_oauth_token && !user.github_oauth_token.token_expired) {
                router.push(LOGIN_REDIRECT);
            }
        }
    }, [user, isUserLoading, router]);

    // Function to handle GitHub OAuth authentication
    const handleGithubAuth = async () => {
        try {
            setIsLoading(true);
            // Use the current URL's origin as the redirect URI
            const redirectUri = `${window.location.origin}/github/callback/oauth`;
            const oauthUrl = await AuthService.getGithubOAuthUrl(redirectUri);
            window.location.href = oauthUrl;
        } catch (error) {
            showToast.error("Failed to get GitHub authentication URL. Please try again.", "github-oauth");
            console.error("GitHub OAuth error:", error);
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-grid p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">GitHub Connection Required</CardTitle>
                    <CardDescription>
                        Connect your GitHub account to use AutoStacks
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                    <div className="rounded-lg bg-secondary p-4">
                        <p className="text-sm text-secondary-foreground">
                            AutoStacks needs access to your GitHub repositories to deploy your Stacks applications.
                            Please connect your GitHub account to continue.
                        </p>
                    </div>
                </CardContent>
                <CardFooter className="flex-col space-y-4">
                    <Button
                        className="w-full"
                        onClick={handleGithubAuth}
                        disabled={isLoading}
                    >
                        <Github />
                        {isLoading ? "Connecting..." : "Connect GitHub Account"}
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => AuthService.logout()}
                    >
                        Sign Out
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
} 