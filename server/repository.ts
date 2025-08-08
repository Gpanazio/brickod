import { nanoid } from "nanoid";
import { db } from "./db";
import { eq } from "drizzle-orm";
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

export interface CrudRepository<T, InsertT> {
  get(id: string): Promise<T | undefined>;
  create(data: InsertT): Promise<T>;
  update(id: string, updates: Partial<InsertT>): Promise<T | undefined>;
  delete(id: string): Promise<boolean>;
  list(): Promise<T[]>;
}

export function createMemoryRepository<T extends { id: string }, InsertT>(
  prepareCreate: (data: InsertT) => T,
  prepareUpdate: (existing: T, updates: Partial<InsertT>) => T,
): CrudRepository<T, InsertT> {
  const items: T[] = [];
  return {
    async get(id: string) {
      return items.find((i) => i.id === id);
    },
    async create(data: InsertT) {
      const entity = prepareCreate(data);
      items.push(entity);
      return entity;
    },
    async update(id: string, updates: Partial<InsertT>) {
      const index = items.findIndex((i) => i.id === id);
      if (index === -1) return undefined;
      items[index] = prepareUpdate(items[index], updates);
      return items[index];
    },
    async delete(id: string) {
      const index = items.findIndex((i) => i.id === id);
      if (index === -1) return false;
      items.splice(index, 1);
      return true;
    },
    async list() {
      return [...items];
    },
  };
}

export function createDatabaseRepository<T extends { id: string }, InsertT>(
  table: any,
  prepareCreate: (data: InsertT) => any,
  prepareUpdate: (updates: Partial<InsertT>) => any,
): CrudRepository<T, InsertT> {
  return {
    async get(id: string) {
      const [row] = await db.select().from(table).where(eq(table.id, id));
      return row || undefined;
    },
    async create(data: InsertT) {
      const record = prepareCreate(data);
      const [created] = await db.insert(table).values([record]).returning();
      return created;
    },
    async update(id: string, updates: Partial<InsertT>) {
      const updateData = prepareUpdate(updates);
      const [updated] = await db
        .update(table)
        .set(updateData)
        .where(eq(table.id, id))
        .returning();
      return updated || undefined;
    },
    async delete(id: string) {
      const result = await db
        .delete(table)
        .where(eq(table.id, id))
        .returning({ id: table.id });
      return result.length > 0;
    },
    async list() {
      return await db.select().from(table);
    },
  };
}

export function withFallback<T, InsertT>(
  repo: CrudRepository<T, InsertT>,
  fallback: CrudRepository<T, InsertT>,
): CrudRepository<T, InsertT> {
  return {
    async get(id: string) {
      try {
        return await repo.get(id);
      } catch (error: any) {
        console.warn("Database error, using fallback:", error.message);
        return fallback.get(id);
      }
    },
    async create(data: InsertT) {
      try {
        return await repo.create(data);
      } catch (error: any) {
        console.warn("Database error, using fallback:", error.message);
        return fallback.create(data);
      }
    },
    async update(id: string, updates: Partial<InsertT>) {
      try {
        return await repo.update(id, updates);
      } catch (error: any) {
        console.warn("Database error, using fallback:", error.message);
        return fallback.update(id, updates);
      }
    },
    async delete(id: string) {
      try {
        return await repo.delete(id);
      } catch (error: any) {
        console.warn("Database error, using fallback:", error.message);
        return fallback.delete(id);
      }
    },
    async list() {
      try {
        return await repo.list();
      } catch (error: any) {
        console.warn("Database error, using fallback:", error.message);
        return fallback.list();
      }
    },
  };
}

// Preparation helpers for entities
export function prepareCallSheetCreate(callSheet: InsertCallSheet): SelectCallSheet {
  const now = new Date();
  return {
    ...callSheet,
    id: callSheet.id || nanoid(),
    locations: Array.from(callSheet.locations || []),
    scenes: Array.from(callSheet.scenes || []),
    contacts: Array.from(callSheet.contacts || []),
    crewCallTimes: Array.from(callSheet.crewCallTimes || []),
    castCallTimes: Array.from(callSheet.castCallTimes || []),
    generalNotes: callSheet.generalNotes || "",
    createdAt: now,
    updatedAt: now,
  };
}

export function prepareCallSheetUpdate(
  updates: Partial<InsertCallSheet>,
) {
  return { ...updates, updatedAt: new Date() };
}

export function prepareTemplateCreate(template: InsertTemplate): SelectTemplate {
  const now = new Date();
  return {
    ...template,
    id: template.id || nanoid(),
    createdAt: now,
    updatedAt: now,
  };
}

export function prepareTemplateUpdate(updates: Partial<InsertTemplate>) {
  return { ...updates, updatedAt: new Date() };
}

export function prepareProjectCreate(project: InsertProject): SelectProject {
  const now = new Date();
  return {
    ...project,
    id: project.id || nanoid(),
    description: project.description || "",
    client: project.client || "",
    status: project.status || "ativo",
    createdAt: now,
    updatedAt: now,
  };
}

export function prepareProjectUpdate(updates: Partial<InsertProject>) {
  return { ...updates, updatedAt: new Date() };
}

export function prepareTeamMemberCreate(
  teamMember: InsertTeamMember,
): SelectTeamMember {
  const now = new Date();
  return {
    ...teamMember,
    id: teamMember.id || nanoid(),
    createdAt: now,
    updatedAt: now,
  } as SelectTeamMember;
}

export function prepareTeamMemberUpdate(
  updates: Partial<InsertTeamMember>,
) {
  return { ...updates, updatedAt: new Date() };
}
