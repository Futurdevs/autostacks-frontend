export interface GitHubInstallation {
  id: number;
  installation_id: number;
  account_id: number;
  account_name: string;
  account_type: string;
  account_avatar_url: string | null;
  is_active: boolean;
  url: string;
  user_id: number | null;
  created_at: string;
  updated_at: string | null;
}

export interface GitHubRepository {
  id: number;
  repository_id: number;
  name: string;
  full_name: string;
  description: string | null;
  private: boolean;
  html_url: string;
  default_branch: string;
  installation_id: number;
  created_at: string;
  updated_at: string | null;
}

export interface PaginatedRepositories {
  total: number;
  page: number;
  per_page: number;
  items: GitHubRepository[];
}

export interface InstallationUrlResponse {
  installation_url: string;
}

export interface GitHubAuthCallbackParams {
  code: string;
  state: string;
  installation_id: number;
  setup_action?: string | null;
}

export interface GithubCallbackResponse {
  success: boolean;
  installation_id: number;
  account_name: string;
  state: Record<string, unknown>;
} 