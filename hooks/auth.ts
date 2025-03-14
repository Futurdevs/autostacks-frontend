import { User } from "@/lib/auth";
import { useEffect } from "react";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getAuthStatus } from "@/lib/server/server-auth";
import { showToast } from "@/lib/toast";
import { removeAuthToken } from "@/lib/cookies";
import { useCurrentURL } from "@/hooks/path";
import { REDIRECT_PARAM } from "@/middlewares/config";


export function useLogout() {
  const router = useRouter();
  const pathname = usePathname();
  const currentURL = useCurrentURL(true);
  const loginPath = pathname === "/login" ? "/" : "/login";

  return () => {
    removeAuthToken();
    router.push(loginPath + `?${REDIRECT_PARAM}=${currentURL}`);
  };
}


export function useCurrentUser() {
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

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
      } catch (error) {
        console.error("Error fetching user data:", error);
        showToast.error(
          "Failed to load user data. Please try again.",
          "user-data-toast"
        );
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [router]);

  return { user, isLoading };
}