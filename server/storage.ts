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
  type InsertTeamMember
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { logger } from "@shared/logger";

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

class MemoryStorage implements IStorage {
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

export class DatabaseStorage implements IStorage {
  private fallbackStorage = new MemoryStorage();
  private isDbConnected = false;

  async getCallSheet(id: string): Promise<SelectCallSheet | undefined> {
    try {
      const [callSheet] = await db.select().from(callSheets).where(eq(callSheets.id, id));
      this.isDbConnected = true;
      return callSheet || undefined;
    } catch (error) {
      logger.warn('Database error, using memory storage:', error.message);
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
      this.isDbConnected = true;
      return created;
    } catch (error) {
      logger.warn('Database error, using memory storage:', error.message);
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
      
      this.isDbConnected = true;
      return updated || undefined;
    } catch (error) {
      logger.warn('Database error, using memory storage:', error.message);
      return this.fallbackStorage.updateCallSheet(id, updates);
    }
  }

  async deleteCallSheet(id: string): Promise<boolean> {
    try {
      const result = await db
        .delete(callSheets)
        .where(eq(callSheets.id, id))
        .returning({ id: callSheets.id });

      this.isDbConnected = true;
      return result.length > 0;
    } catch (error) {
      logger.warn('Database error, using memory storage:', error.message);
      return this.fallbackStorage.deleteCallSheet(id);
    }
  }

  async listCallSheets(): Promise<SelectCallSheet[]> {
    try {
      const result = await db.select().from(callSheets);
      this.isDbConnected = true;
      return result;
    } catch (error) {
      logger.warn('Database error, using memory storage:', error.message);
      return this.fallbackStorage.listCallSheets();
    }
  }

  // Template operations
  async getTemplate(id: string): Promise<SelectTemplate | undefined> {
    try {
      const [template] = await db.select().from(templates).where(eq(templates.id, id));
      this.isDbConnected = true;
      return template || undefined;
    } catch (error) {
      logger.warn('Database error, using memory storage:', error.message);
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
      this.isDbConnected = true;
      return created;
    } catch (error) {
      logger.warn('Database error, using memory storage:', error.message);
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
      
      this.isDbConnected = true;
      return updated || undefined;
    } catch (error) {
      logger.warn('Database error, using memory storage:', error.message);
      return this.fallbackStorage.updateTemplate(id, updates);
    }
  }

  async deleteTemplate(id: string): Promise<boolean> {
    try {
      const result = await db
        .delete(templates)
        .where(eq(templates.id, id))
        .returning({ id: templates.id });

      this.isDbConnected = true;
      return result.length > 0;
    } catch (error) {
      logger.warn('Database error, using memory storage:', error.message);
      return this.fallbackStorage.deleteTemplate(id);
    }
  }

  async listTemplates(): Promise<SelectTemplate[]> {
    try {
      const result = await db.select().from(templates);
      this.isDbConnected = true;
      return result;
    } catch (error) {
      logger.warn('Database error, using memory storage:', error.message);
      return this.fallbackStorage.listTemplates();
    }
  }

  async getTemplatesByCategory(category: string): Promise<SelectTemplate[]> {
    try {
      const result = await db.select().from(templates).where(eq(templates.category, category));
      this.isDbConnected = true;
      return result;
    } catch (error) {
      logger.warn('Database error, using memory storage:', error.message);
      return this.fallbackStorage.getTemplatesByCategory(category);
    }
  }

  async getDefaultTemplates(): Promise<SelectTemplate[]> {
    try {
      const result = await db.select().from(templates).where(eq(templates.isDefault, true));
      this.isDbConnected = true;
      return result;
    } catch (error) {
      logger.warn('Database error, using memory storage:', error.message);
      return this.fallbackStorage.getDefaultTemplates();
    }
  }

  // Project operations
  async getProject(id: string): Promise<SelectProject | undefined> {
    try {
      const [project] = await db.select().from(projects).where(eq(projects.id, id));
      this.isDbConnected = true;
      return project || undefined;
    } catch (error) {
      logger.warn('Database error, using memory storage:', error.message);
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
      this.isDbConnected = true;
      return created;
    } catch (error) {
      logger.warn('Database error, using memory storage:', error.message);
      return this.fallbackStorage.createProject(project);
    }
  }

  async updateProject(id: string, updates: Partial<InsertProject>): Promise<SelectProject | undefined> {
    try {
      const now = new Date();
      const updateData: any = { ...updates, updatedAt: now };

      const [updated] = await db.update(projects).set(updateData).where(eq(projects.id, id)).returning();
      this.isDbConnected = true;
      return updated || undefined;
    } catch (error) {
      logger.warn('Database error, using memory storage:', error.message);
      return this.fallbackStorage.updateProject(id, updates);
    }
  }

  async deleteProject(id: string): Promise<boolean> {
    try {
      const result = await db
        .delete(projects)
        .where(eq(projects.id, id))
        .returning({ id: projects.id });
      this.isDbConnected = true;
      return result.length > 0;
    } catch (error) {
      logger.warn('Database error, using memory storage:', error.message);
      return this.fallbackStorage.deleteProject(id);
    }
  }

  async listProjects(): Promise<SelectProject[]> {
    try {
      const result = await db.select().from(projects);
      this.isDbConnected = true;
      return result;
    } catch (error) {
      logger.warn('Database error, using memory storage:', error.message);
      return this.fallbackStorage.listProjects();
    }
  }

  // Team member operations
  async getTeamMember(id: string): Promise<SelectTeamMember | undefined> {
    try {
      const [teamMember] = await db.select().from(teamMembers).where(eq(teamMembers.id, id));
      this.isDbConnected = true;
      return teamMember || undefined;
    } catch (error) {
      logger.warn('Database error, using memory storage:', error.message);
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
      this.isDbConnected = true;
      return created;
    } catch (error) {
      logger.warn('Database error, using memory storage:', error.message);
      return this.fallbackStorage.createTeamMember(teamMember);
    }
  }

  async updateTeamMember(id: string, updates: Partial<InsertTeamMember>): Promise<SelectTeamMember | undefined> {
    try {
      const now = new Date();
      const updateData: any = { ...updates, updatedAt: now };
      const [updated] = await db.update(teamMembers).set(updateData).where(eq(teamMembers.id, id)).returning();
      this.isDbConnected = true;
      return updated || undefined;
    } catch (error) {
      logger.warn('Database error, using memory storage:', error.message);
      return this.fallbackStorage.updateTeamMember(id, updates);
    }
  }

  async deleteTeamMember(id: string): Promise<boolean> {
    try {
      const result = await db
        .delete(teamMembers)
        .where(eq(teamMembers.id, id))
        .returning({ id: teamMembers.id });
      this.isDbConnected = true;
      return result.length > 0;
    } catch (error) {
      logger.warn('Database error, using memory storage:', error.message);
      return this.fallbackStorage.deleteTeamMember(id);
    }
  }

  async listTeamMembers(): Promise<SelectTeamMember[]> {
    try {
      const result = await db.select().from(teamMembers);
      this.isDbConnected = true;
      return result;
    } catch (error) {
      logger.warn('Database error, using memory storage:', error.message);
      return this.fallbackStorage.listTeamMembers();
    }
  }
}

export const storage = new DatabaseStorage();