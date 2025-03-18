import axios from "./axios";

// Project interfaces
export interface Project {
  id: string;
  name: string;
  description?: string;
  status: string;
  created_at: string;
  updated_at?: string;
}

export interface ProjectList {
  items: Project[];
  total: number;
  page?: number;
  page_size?: number;
}

export interface ProjectCreate {
  name: string;
  description?: string;
}

export interface ProjectUpdate {
  name?: string;
  description?: string;
  status?: string;
}

class ProjectService {
  private static instance: ProjectService;

  private constructor() {}

  public static getInstance(): ProjectService {
    if (!ProjectService.instance) {
      ProjectService.instance = new ProjectService();
    }
    return ProjectService.instance;
  }

  /**
   * Get all projects
   */
  async listProjects(page: number = 1, pageSize: number = 10): Promise<Project[]> {
    try {
      const response = await axios.get("/projects", {
        params: {
          page,
          page_size: pageSize,
        },
      });
      return response.data.items;
    } catch (error) {
      console.error("Error listing projects:", error);
      throw error;
    }
  }

  /**
   * Get a single project by ID
   */
  async getProject(projectId: string): Promise<Project> {
    try {
      const response = await axios.get(`/projects/${projectId}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting project ${projectId}:`, error);
      throw error;
    }
  }

  /**
   * Create a new project
   */
  async createProject(data: ProjectCreate): Promise<Project> {
    try {
      const response = await axios.post("/projects", data);
      return response.data;
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  }

  /**
   * Update an existing project
   */
  async updateProject(projectId: string, data: ProjectUpdate): Promise<Project> {
    try {
      const response = await axios.patch(`/projects/${projectId}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating project ${projectId}:`, error);
      throw error;
    }
  }

  /**
   * Delete a project
   */
  async deleteProject(projectId: string): Promise<void> {
    try {
      await axios.delete(`/projects/${projectId}`);
    } catch (error) {
      console.error(`Error deleting project ${projectId}:`, error);
      throw error;
    }
  }
}

// Export a singleton instance
export const projectService = ProjectService.getInstance(); 