import axiosInstance from "./axios";
import { showToast } from "./toast";
import { handleApiError } from "./auth";
import {
  GitHubInstallation,
  GitHubRepository,
  InstallationUrlResponse,
  PaginatedRepositories,
} from "@/types/github";

export type {
  GitHubInstallation,
  GitHubRepository,
  InstallationUrlResponse,
  PaginatedRepositories,
};

type InstallationRepositoryFilter = {
  page?: number;
  per_page?: number;
  sort?: string;
  search?: string;
  status?: "active" | "inactive";
  exclude_private?: boolean;
  exclude_ids?: number[];
};

export const GitHubService = {
  // Get all GitHub installations for the current user
  getInstallations: async (): Promise<GitHubInstallation[]> => {
    try {
      const loadingToastId = showToast.loading(
        "Loading GitHub installations...",
        "github-installations-toast"
      );
      const response = await axiosInstance.get<GitHubInstallation[]>(
        "/github/installations"
      );
      showToast.dismiss(loadingToastId);
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      showToast.error(errorMessage, "github-installations-toast");
      throw errorMessage;
    }
  },

  // Get a specific GitHub installation
  getInstallation: async (
    installationId: number
  ): Promise<GitHubInstallation> => {
    try {
      const loadingToastId = showToast.loading(
        "Loading installation details...",
        "github-installation-toast"
      );
      const response = await axiosInstance.get<GitHubInstallation>(
        `/github/installations/${installationId}`
      );
      showToast.dismiss(loadingToastId);
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      showToast.error(errorMessage, "github-installation-toast");
      throw errorMessage;
    }
  },

  // Get a new installation URL for the current user
  getNewInstallationUrl: async (): Promise<InstallationUrlResponse> => {
    try {
      const loadingToastId = showToast.loading(
        "Generating installation URL...",
        "github-install-toast"
      );
      const response = await axiosInstance.get<InstallationUrlResponse>(
        "/github/install"
      );
      showToast.dismiss(loadingToastId);
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      showToast.error(errorMessage, "github-install-toast");
      throw errorMessage;
    }
  },

  // Get repositories for a specific GitHub installation
  getInstallationRepositories: async (
    installationId: number,
    filter: InstallationRepositoryFilter
  ): Promise<PaginatedRepositories> => {
    try {
      const loadingToastId = showToast.loading(
        "Loading repositories...",
        "github-repos-toast"
      );
      const response = await axiosInstance.get<PaginatedRepositories>(
        `/github/installations/${installationId}/repositories`,
        { params: filter }
      );
      showToast.dismiss(loadingToastId);
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      showToast.error(errorMessage, "github-repos-toast");
      throw errorMessage;
    }
  },
};
