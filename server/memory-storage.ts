import { nanoid } from "nanoid";
import {
  type SelectCallSheet,
  type InsertCallSheet,
  type SelectTemplate,
  type InsertTemplate,
  type SelectProject,
  type InsertProject,
  type SelectTeamMember,
  type InsertTeamMember,
} from "@shared/schema";
import type { IStorage } from "./storage";

export class MemoryStorage implements IStorage {
  private callSheets: SelectCallSheet[] = [];
  private templates: SelectTemplate[] = [];
  private projects: SelectProject[] = [];
  private teamMembers: SelectTeamMember[] = [];

  async getCallSheet(id: string): Promise<SelectCallSheet | undefined> {
    return this.callSheets.find(cs => cs.id === id);
  }

  async createCallSheet(callSheet: InsertCallSheet): Promise<SelectCallSheet> {
    const now = new Date();
    const newCallSheet: SelectCallSheet = {
      ...callSheet,
      id: callSheet.id || nanoid(),
      locations: callSheet.locations || [],
      scenes: callSheet.scenes || [],
      contacts: callSheet.contacts || [],
      crewCallTimes: callSheet.crewCallTimes || [],
      castCallTimes: callSheet.castCallTimes || [],
      generalNotes: callSheet.generalNotes || '',
      createdAt: now,
      updatedAt: now,
    };

    this.callSheets.push(newCallSheet);
    return newCallSheet;
  }

  async updateCallSheet(id: string, updates: Partial<InsertCallSheet>): Promise<SelectCallSheet | undefined> {
    const index = this.callSheets.findIndex(cs => cs.id === id);
    if (index === -1) return undefined;

    this.callSheets[index] = {
      ...this.callSheets[index],
      ...updates,
      updatedAt: new Date(),
    };

    return this.callSheets[index];
  }

  async deleteCallSheet(id: string): Promise<boolean> {
    const index = this.callSheets.findIndex(cs => cs.id === id);
    if (index === -1) return false;

    this.callSheets.splice(index, 1);
    return true;
  }

  async listCallSheets(): Promise<SelectCallSheet[]> {
    return [...this.callSheets];
  }

  async getTemplate(id: string): Promise<SelectTemplate | undefined> {
    return this.templates.find(t => t.id === id);
  }

  async createTemplate(template: InsertTemplate): Promise<SelectTemplate> {
    const now = new Date();
    const newTemplate: SelectTemplate = {
      ...template,
      id: template.id || nanoid(),
      isDefault: template.isDefault || false,
      createdAt: now,
      updatedAt: now,
    };

    this.templates.push(newTemplate);
    return newTemplate;
  }

  async updateTemplate(id: string, updates: Partial<InsertTemplate>): Promise<SelectTemplate | undefined> {
    const index = this.templates.findIndex(t => t.id === id);
    if (index === -1) return undefined;

    this.templates[index] = {
      ...this.templates[index],
      ...updates,
      updatedAt: new Date(),
    };

    return this.templates[index];
  }

  async deleteTemplate(id: string): Promise<boolean> {
    const index = this.templates.findIndex(t => t.id === id);
    if (index === -1) return false;

    this.templates.splice(index, 1);
    return true;
  }

  async listTemplates(): Promise<SelectTemplate[]> {
    return [...this.templates];
  }

  async getTemplatesByCategory(category: string): Promise<SelectTemplate[]> {
    return this.templates.filter(t => t.category === category);
  }

  async getDefaultTemplates(): Promise<SelectTemplate[]> {
    return this.templates.filter(t => t.isDefault);
  }

  // Project operations
  async getProject(id: string): Promise<SelectProject | undefined> {
    return this.projects.find(p => p.id === id);
  }

  async createProject(project: InsertProject): Promise<SelectProject> {
    const now = new Date();
    const newProject: SelectProject = {
      ...project,
      id: project.id || nanoid(),
      description: project.description || '',
      client: project.client || '',
      status: project.status || 'ativo',
      createdAt: now,
      updatedAt: now,
    };

    this.projects.push(newProject);
    return newProject;
  }

  async updateProject(id: string, updates: Partial<InsertProject>): Promise<SelectProject | undefined> {
    const index = this.projects.findIndex(p => p.id === id);
    if (index === -1) return undefined;

    this.projects[index] = {
      ...this.projects[index],
      ...updates,
      updatedAt: new Date(),
    };

    return this.projects[index];
  }

  async deleteProject(id: string): Promise<boolean> {
    const index = this.projects.findIndex(p => p.id === id);
    if (index === -1) return false;

    this.projects.splice(index, 1);
    return true;
  }

  async listProjects(): Promise<SelectProject[]> {
    return [...this.projects];
  }

  // Team member operations
  async getTeamMember(id: string): Promise<SelectTeamMember | undefined> {
    return this.teamMembers.find(tm => tm.id === id);
  }

  async createTeamMember(teamMember: InsertTeamMember): Promise<SelectTeamMember> {
    const now = new Date();
    const newMember: SelectTeamMember = {
      ...teamMember,
      id: teamMember.id || nanoid(),
      createdAt: now,
      updatedAt: now,
    } as SelectTeamMember;
    this.teamMembers.push(newMember);
    return newMember;
  }

  async updateTeamMember(id: string, updates: Partial<InsertTeamMember>): Promise<SelectTeamMember | undefined> {
    const index = this.teamMembers.findIndex(tm => tm.id === id);
    if (index === -1) return undefined;
    this.teamMembers[index] = {
      ...this.teamMembers[index],
      ...updates,
      updatedAt: new Date(),
    } as SelectTeamMember;
    return this.teamMembers[index];
  }

  async deleteTeamMember(id: string): Promise<boolean> {
    const index = this.teamMembers.findIndex(tm => tm.id === id);
    if (index === -1) return false;
    this.teamMembers.splice(index, 1);
    return true;
  }

  async listTeamMembers(): Promise<SelectTeamMember[]> {
    return [...this.teamMembers];
  }
}
