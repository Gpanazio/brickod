import type {
  SelectCallSheet,
  InsertCallSheet,
  SelectTemplate,
  InsertTemplate,
  SelectProject,
  InsertProject,
  SelectTeamMember,
  InsertTeamMember,
} from "@shared/schema";
import { DatabaseStorage } from "./database-storage";

export interface IStorage {
  // Call sheet operations
  getCallSheet(id: string): Promise<SelectCallSheet | undefined>;
  createCallSheet(callSheet: InsertCallSheet): Promise<SelectCallSheet>;
  updateCallSheet(id: string, updates: Partial<InsertCallSheet>): Promise<SelectCallSheet | undefined>;
  deleteCallSheet(id: string): Promise<boolean>;
  listCallSheets(): Promise<SelectCallSheet[]>;

  // Template operations
  getTemplate(id: string): Promise<SelectTemplate | undefined>;
  createTemplate(template: InsertTemplate): Promise<SelectTemplate>;
  updateTemplate(id: string, updates: Partial<InsertTemplate>): Promise<SelectTemplate | undefined>;
  deleteTemplate(id: string): Promise<boolean>;
  listTemplates(): Promise<SelectTemplate[]>;
  getTemplatesByCategory(category: string): Promise<SelectTemplate[]>;
  getDefaultTemplates(): Promise<SelectTemplate[]>;

  // Project operations
  getProject(id: string): Promise<SelectProject | undefined>;
  createProject(project: InsertProject): Promise<SelectProject>;
  updateProject(id: string, updates: Partial<InsertProject>): Promise<SelectProject | undefined>;
  deleteProject(id: string): Promise<boolean>;
  listProjects(): Promise<SelectProject[]>;

  // Team member operations
  getTeamMember(id: string): Promise<SelectTeamMember | undefined>;
  createTeamMember(teamMember: InsertTeamMember): Promise<SelectTeamMember>;
  updateTeamMember(id: string, updates: Partial<InsertTeamMember>): Promise<SelectTeamMember | undefined>;
  deleteTeamMember(id: string): Promise<boolean>;
  listTeamMembers(): Promise<SelectTeamMember[]>;
}

export function createStorage(): IStorage {
  return new DatabaseStorage();
}

export const storage = createStorage();
