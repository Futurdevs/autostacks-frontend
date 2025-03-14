"use client";
import { REDIRECT_PARAM } from "@/middlewares/config";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function useRedirectPath(defaultPath: string) {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get(REDIRECT_PARAM);
  if (redirectTo) {
    return decodeURIComponent(redirectTo);
  }
  return defaultPath;
}

export function useCurrentURL(encodeQueryParams = false) {
  const [currentURL, setCurrentURL] = useState<string>();

  useEffect(() => {
    const handlePathChange = () => {
      const path = window.location.pathname;
      let search = window.location.search;
      if (encodeQueryParams) {
        search = "?" + encodeURIComponent(search.slice(1));
      }
      setCurrentURL(`${path}${search}`);
    };
    window.addEventListener("popstate", handlePathChange);
    handlePathChange();
    return () => {
      window.removeEventListener("popstate", handlePathChange);
    };
  }, [encodeQueryParams]);
  return currentURL;
}
