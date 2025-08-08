import { nanoid } from "nanoid";
import {
  callSheets,
  templates,
  projects,
  teamMembers,
  type SelectCallSheet,
  type InsertCallSheet,
  type SelectTemplate,
  type InsertTemplate,
  type SelectProject,
  type InsertProject,
  type SelectTeamMember,
  type InsertTeamMember,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import type { IStorage } from "./storage";
import { MemoryStorage } from "./memory-storage";

export class DatabaseStorage implements IStorage {
  constructor(private fallbackStorage = new MemoryStorage()) {}

  async getCallSheet(id: string): Promise<SelectCallSheet | undefined> {
    try {
      const [callSheet] = await db.select().from(callSheets).where(eq(callSheets.id, id));
      return callSheet || undefined;
    } catch (error: any) {
      console.warn('Database error, using memory storage:', error.message);
      return this.fallbackStorage.getCallSheet(id);
    }
  }

  async createCallSheet(callSheet: InsertCallSheet): Promise<SelectCallSheet> {
    try {
      const now = new Date();
      const newCallSheet = {
        ...callSheet,
        id: callSheet.id || nanoid(),
        locations: Array.from(callSheet.locations || []),
        scenes: Array.from(callSheet.scenes || []),
        contacts: Array.from(callSheet.contacts || []),
        crewCallTimes: Array.from(callSheet.crewCallTimes || []),
        castCallTimes: Array.from(callSheet.castCallTimes || []),
        generalNotes: callSheet.generalNotes || '',
        createdAt: now,
        updatedAt: now,
      };

      const [created] = await db
        .insert(callSheets)
        .values([newCallSheet])
        .returning();
      return created;
    } catch (error: any) {
      console.warn('Database error, using memory storage:', error.message);
      return this.fallbackStorage.createCallSheet(callSheet);
    }
  }

  async updateCallSheet(id: string, updates: Partial<InsertCallSheet>): Promise<SelectCallSheet | undefined> {
    try {
      const now = new Date();
      const updateData: any = {
        ...updates,
        updatedAt: now,
      };

      const [updated] = await db
        .update(callSheets)
        .set(updateData)
        .where(eq(callSheets.id, id))
        .returning();
      return updated || undefined;
    } catch (error: any) {
      console.warn('Database error, using memory storage:', error.message);
      return this.fallbackStorage.updateCallSheet(id, updates);
    }
  }

  async deleteCallSheet(id: string): Promise<boolean> {
    try {
      const result = await db
        .delete(callSheets)
        .where(eq(callSheets.id, id))
        .returning({ id: callSheets.id });
      return result.length > 0;
    } catch (error: any) {
      console.warn('Database error, using memory storage:', error.message);
      return this.fallbackStorage.deleteCallSheet(id);
    }
  }

  async listCallSheets(): Promise<SelectCallSheet[]> {
    try {
      const result = await db.select().from(callSheets);
      return result;
    } catch (error: any) {
      console.warn('Database error, using memory storage:', error.message);
      return this.fallbackStorage.listCallSheets();
    }
  }

  // Template operations
  async getTemplate(id: string): Promise<SelectTemplate | undefined> {
    try {
      const [template] = await db.select().from(templates).where(eq(templates.id, id));
      return template || undefined;
    } catch (error: any) {
      console.warn('Database error, using memory storage:', error.message);
      return this.fallbackStorage.getTemplate(id);
    }
  }

  async createTemplate(template: InsertTemplate): Promise<SelectTemplate> {
    try {
      const now = new Date();
      const newTemplate = {
        ...template,
        id: template.id || nanoid(),
        createdAt: now,
        updatedAt: now,
      };

      const [created] = await db
        .insert(templates)
        .values([newTemplate])
        .returning();
      return created;
    } catch (error: any) {
      console.warn('Database error, using memory storage:', error.message);
      return this.fallbackStorage.createTemplate(template);
    }
  }

  async updateTemplate(id: string, updates: Partial<InsertTemplate>): Promise<SelectTemplate | undefined> {
    try {
      const now = new Date();
      const updateData: any = {
        ...updates,
        updatedAt: now,
      };

      const [updated] = await db
        .update(templates)
        .set(updateData)
        .where(eq(templates.id, id))
        .returning();
      return updated || undefined;
    } catch (error: any) {
      console.warn('Database error, using memory storage:', error.message);
      return this.fallbackStorage.updateTemplate(id, updates);
    }
  }

  async deleteTemplate(id: string): Promise<boolean> {
    try {
      const result = await db
        .delete(templates)
        .where(eq(templates.id, id))
        .returning({ id: templates.id });
      return result.length > 0;
    } catch (error: any) {
      console.warn('Database error, using memory storage:', error.message);
      return this.fallbackStorage.deleteTemplate(id);
    }
  }

  async listTemplates(): Promise<SelectTemplate[]> {
    try {
      const result = await db.select().from(templates);
      return result;
    } catch (error: any) {
      console.warn('Database error, using memory storage:', error.message);
      return this.fallbackStorage.listTemplates();
    }
  }

  async getTemplatesByCategory(category: string): Promise<SelectTemplate[]> {
    try {
      const result = await db.select().from(templates).where(eq(templates.category, category));
      return result;
    } catch (error: any) {
      console.warn('Database error, using memory storage:', error.message);
      return this.fallbackStorage.getTemplatesByCategory(category);
    }
  }

  async getDefaultTemplates(): Promise<SelectTemplate[]> {
    try {
      const result = await db.select().from(templates).where(eq(templates.isDefault, true));
      return result;
    } catch (error: any) {
      console.warn('Database error, using memory storage:', error.message);
      return this.fallbackStorage.getDefaultTemplates();
    }
  }

  // Project operations
  async getProject(id: string): Promise<SelectProject | undefined> {
    try {
      const [project] = await db.select().from(projects).where(eq(projects.id, id));
      return project || undefined;
    } catch (error: any) {
      console.warn('Database error, using memory storage:', error.message);
      return this.fallbackStorage.getProject(id);
    }
  }

  async createProject(project: InsertProject): Promise<SelectProject> {
    try {
      const now = new Date();
      const newProject = {
        ...project,
        id: project.id || nanoid(),
        description: project.description || '',
        client: project.client || '',
        status: project.status || 'ativo',
        createdAt: now,
        updatedAt: now,
      };

      const [created] = await db.insert(projects).values([newProject]).returning();
      return created;
    } catch (error: any) {
      console.warn('Database error, using memory storage:', error.message);
      return this.fallbackStorage.createProject(project);
    }
  }

  async updateProject(id: string, updates: Partial<InsertProject>): Promise<SelectProject | undefined> {
    try {
      const now = new Date();
      const updateData: any = { ...updates, updatedAt: now };

      const [updated] = await db.update(projects).set(updateData).where(eq(projects.id, id)).returning();
      return updated || undefined;
    } catch (error: any) {
      console.warn('Database error, using memory storage:', error.message);
      return this.fallbackStorage.updateProject(id, updates);
    }
  }

  async deleteProject(id: string): Promise<boolean> {
    try {
      const result = await db
        .delete(projects)
        .where(eq(projects.id, id))
        .returning({ id: projects.id });
      return result.length > 0;
    } catch (error: any) {
      console.warn('Database error, using memory storage:', error.message);
      return this.fallbackStorage.deleteProject(id);
    }
  }

  async listProjects(): Promise<SelectProject[]> {
    try {
      const result = await db.select().from(projects);
      return result;
    } catch (error: any) {
      console.warn('Database error, using memory storage:', error.message);
      return this.fallbackStorage.listProjects();
    }
  }

  // Team member operations
  async getTeamMember(id: string): Promise<SelectTeamMember | undefined> {
    try {
      const [teamMember] = await db.select().from(teamMembers).where(eq(teamMembers.id, id));
      return teamMember || undefined;
    } catch (error: any) {
      console.warn('Database error, using memory storage:', error.message);
      return this.fallbackStorage.getTeamMember(id);
    }
  }

  async createTeamMember(teamMember: InsertTeamMember): Promise<SelectTeamMember> {
    try {
      const now = new Date();
      const newMember = {
        ...teamMember,
        id: teamMember.id || nanoid(),
        createdAt: now,
        updatedAt: now,
      };
      const [created] = await db.insert(teamMembers).values([newMember]).returning();
      return created;
    } catch (error: any) {
      console.warn('Database error, using memory storage:', error.message);
      return this.fallbackStorage.createTeamMember(teamMember);
    }
  }

  async updateTeamMember(id: string, updates: Partial<InsertTeamMember>): Promise<SelectTeamMember | undefined> {
    try {
      const now = new Date();
      const updateData: any = { ...updates, updatedAt: now };
      const [updated] = await db.update(teamMembers).set(updateData).where(eq(teamMembers.id, id)).returning();
      return updated || undefined;
    } catch (error: any) {
      console.warn('Database error, using memory storage:', error.message);
      return this.fallbackStorage.updateTeamMember(id, updates);
    }
  }

  async deleteTeamMember(id: string): Promise<boolean> {
    try {
      const result = await db
        .delete(teamMembers)
        .where(eq(teamMembers.id, id))
        .returning({ id: teamMembers.id });
      return result.length > 0;
    } catch (error: any) {
      console.warn('Database error, using memory storage:', error.message);
      return this.fallbackStorage.deleteTeamMember(id);
    }
  }

  async listTeamMembers(): Promise<SelectTeamMember[]> {
    try {
      const result = await db.select().from(teamMembers);
      return result;
    } catch (error: any) {
      console.warn('Database error, using memory storage:', error.message);
      return this.fallbackStorage.listTeamMembers();
    }
  }
}
