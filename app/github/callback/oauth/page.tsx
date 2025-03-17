"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthService from '@/lib/auth';
import { showToast } from '@/lib/toast';
import { LOGIN_REDIRECT } from '@/middlewares/config';
import { Card, CardContent } from '@/components/ui/card';

export default function GitHubCallbackPage() {
    const [isProcessing, setIsProcessing] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const code = searchParams.get('code');
        const state = searchParams.get('state');

        if (!code || !state) {
            setError('Missing required parameters for GitHub authentication.');
            setIsProcessing(false);
            return;
        }

        const processCallback = async () => {
            try {
                const result = await AuthService.handleGithubOAuthCallback({ code, state });

                if (result.success) {
                    showToast.success('GitHub authentication successful!', 'github-oauth-success-toast');
                    // Redirect to dashboard after successful authentication
                    router.push(LOGIN_REDIRECT);
                } else {
                    setError('GitHub authentication failed. Please try again.');
                    setIsProcessing(false);
                }
            } catch (error) {
                setError('Failed to process GitHub authentication. Please try again.');
                console.error('GitHub OAuth callback error:', error);
                setIsProcessing(false);
            }
        };

        processCallback();
    }, [searchParams, router]);

    if (isProcessing) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-grid p-4">
                <Card className="w-full max-w-md text-center p-6">
                    <CardContent className="pt-6">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                        <h2 className="text-xl font-semibold mb-2">Processing GitHub Authentication</h2>
                        <p className="text-muted-foreground">Please wait while we connect your GitHub account...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-grid p-4">
                <Card className="w-full max-w-md text-center p-6">
                    <CardContent className="pt-6">
                        <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4">
                            <p>{error}</p>
                        </div>
                        <button
                            onClick={() => router.push('/pending-github-oauth')}
                            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 mt-2"
                        >
                            Try Again
                        </button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return null;
} 