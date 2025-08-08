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
import {
  createMemoryRepository,
  prepareCallSheetCreate,
  prepareCallSheetUpdate,
  prepareTemplateCreate,
  prepareTemplateUpdate,
  prepareProjectCreate,
  prepareProjectUpdate,
  prepareTeamMemberCreate,
  prepareTeamMemberUpdate,
} from "./repository";

export class MemoryStorage implements IStorage {
  private callSheetsRepo = createMemoryRepository<SelectCallSheet, InsertCallSheet>(
    prepareCallSheetCreate,
    (existing, updates) => ({
      ...existing,
      ...prepareCallSheetUpdate(updates),
    }),
  );
  private templatesRepo = createMemoryRepository<SelectTemplate, InsertTemplate>(
    prepareTemplateCreate,
    (existing, updates) => ({
      ...existing,
      ...prepareTemplateUpdate(updates),
    }),
  );
  private projectsRepo = createMemoryRepository<SelectProject, InsertProject>(
    prepareProjectCreate,
    (existing, updates) => ({
      ...existing,
      ...prepareProjectUpdate(updates),
    }),
  );
  private teamMembersRepo = createMemoryRepository<SelectTeamMember, InsertTeamMember>(
    prepareTeamMemberCreate,
    (existing, updates) => ({
      ...existing,
      ...prepareTeamMemberUpdate(updates),
    }),
  );

  async getCallSheet(id: string) {
    return this.callSheetsRepo.get(id);
  }

  async createCallSheet(callSheet: InsertCallSheet) {
    return this.callSheetsRepo.create(callSheet);
  }

  async updateCallSheet(id: string, updates: Partial<InsertCallSheet>) {
    return this.callSheetsRepo.update(id, updates);
  }

  async deleteCallSheet(id: string) {
    return this.callSheetsRepo.delete(id);
  }

  async listCallSheets() {
    return this.callSheetsRepo.list();
  }

  async getTemplate(id: string) {
    return this.templatesRepo.get(id);
  }

  async createTemplate(template: InsertTemplate) {
    return this.templatesRepo.create(template);
  }

  async updateTemplate(id: string, updates: Partial<InsertTemplate>) {
    return this.templatesRepo.update(id, updates);
  }

  async deleteTemplate(id: string) {
    return this.templatesRepo.delete(id);
  }

  async listTemplates() {
    return this.templatesRepo.list();
  }

  async getTemplatesByCategory(category: string) {
    const all = await this.templatesRepo.list();
    return all.filter((t) => t.category === category);
  }

  async getDefaultTemplates() {
    const all = await this.templatesRepo.list();
    return all.filter((t) => t.isDefault);
  }

  async getProject(id: string) {
    return this.projectsRepo.get(id);
  }

  async createProject(project: InsertProject) {
    return this.projectsRepo.create(project);
  }

  async updateProject(id: string, updates: Partial<InsertProject>) {
    return this.projectsRepo.update(id, updates);
  }

  async deleteProject(id: string) {
    return this.projectsRepo.delete(id);
  }

  async listProjects() {
    return this.projectsRepo.list();
  }

  async getTeamMember(id: string) {
    return this.teamMembersRepo.get(id);
  }

  async createTeamMember(teamMember: InsertTeamMember) {
    return this.teamMembersRepo.create(teamMember);
  }

  async updateTeamMember(id: string, updates: Partial<InsertTeamMember>) {
    return this.teamMembersRepo.update(id, updates);
  }

  async deleteTeamMember(id: string) {
    return this.teamMembersRepo.delete(id);
  }

  async listTeamMembers() {
    return this.teamMembersRepo.list();
  }
}
