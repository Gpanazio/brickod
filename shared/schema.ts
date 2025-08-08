import { z } from "zod";
import { pgTable, text, timestamp, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

// Zod schemas for frontend validation
export const locationSchema = z.object({
  id: z.string(),
  address: z.string(),
  notes: z.string(),
});

export const sceneSchema = z.object({
  id: z.string(),
  number: z.string(),
  description: z.string(),
  cast: z.string(),
  estimatedTime: z.string().optional(),
});

export const contactSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  phone: z.string(),
});

export const attachmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
  type: z.string(),
});

export const callTimeSchema = z.object({
  id: z.string(),
  time: z.string(),
  memberId: z.string().optional(),
  name: z.string(),
  role: z.string(),
  phone: z.string().optional(),
});

export const teamMemberSchema = z.object({
  id: z.string().optional(),
  projectId: z.string().optional(),
  name: z.string(),
  role: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const projectSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional(),
  client: z.string().optional(),
  status: z.enum(['ativo', 'pausado', 'concluído']).default('ativo'),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const templateSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  isDefault: z.boolean().default(false),
  templateData: z.object({
    productionTitle: z.string().optional(),
    producer: z.string().optional(),
    director: z.string().optional(),
    client: z.string().optional(),
    attachments: z.array(attachmentSchema).default([]),
    locations: z.array(locationSchema).default([]),
    scenes: z.array(sceneSchema).default([]),
    contacts: z.array(contactSchema).default([]),
    crewCallTimes: z.array(callTimeSchema).default([]),
    castCallTimes: z.array(callTimeSchema).default([]),
    generalNotes: z.string().default(''),
  }),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const callSheetSchema = z.object({
  id: z.string().optional(),
  projectId: z.string().optional(),
  productionTitle: z.string(),
  shootingDate: z.string(),
  producer: z.string().optional(),
  director: z.string().optional(),
  client: z.string().optional(),
  scriptUrl: z.string().optional(),
  scriptName: z.string().optional(),
  attachments: z.array(attachmentSchema).default([]),
  startTime: z.string().optional(),
  lunchBreakTime: z.string().optional(),
  endTime: z.string().optional(),
  locations: z.array(locationSchema),
  scenes: z.array(sceneSchema),
  contacts: z.array(contactSchema),
  crewCallTimes: z.array(callTimeSchema),
  castCallTimes: z.array(callTimeSchema),
  generalNotes: z.string(),
  status: z.enum(['rascunho', 'finalizada']).default('rascunho'),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

// Drizzle database tables
export const projects = pgTable('projects', {
  id: text('id').primaryKey().notNull(),
  name: text('name').notNull(),
  description: text('description'),
  client: text('client'),
  status: text('status').notNull().default('ativo'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const callSheets = pgTable('call_sheets', {
  id: text('id').primaryKey().notNull(),
  projectId: text('project_id'),
  productionTitle: text('production_title').notNull(),
  shootingDate: text('shooting_date').notNull(),
  producer: text('producer'),
  director: text('director'),
  client: text('client'),
  scriptUrl: text('script_url'),
  scriptName: text('script_name'),
  attachments: json('attachments').$type<Attachment[]>().notNull().default([]),
  startTime: text('start_time'),
  lunchBreakTime: text('lunch_break_time'),
  endTime: text('end_time'),
  locations: json('locations').$type<Location[]>().notNull().default([]),
  scenes: json('scenes').$type<Scene[]>().notNull().default([]),
  contacts: json('contacts').$type<Contact[]>().notNull().default([]),
  crewCallTimes: json('crew_call_times').$type<CallTime[]>().notNull().default([]),
  castCallTimes: json('cast_call_times').$type<CallTime[]>().notNull().default([]),
  generalNotes: text('general_notes').notNull().default(''),
  status: text('status').notNull().default('rascunho'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const templates = pgTable('templates', {
  id: text('id').primaryKey().notNull(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  isDefault: boolean('is_default').notNull().default(false),
  templateData: json('template_data').$type<{
    productionTitle?: string;
    producer?: string;
    director?: string;
    client?: string;
    locations: Location[];
    scenes: Scene[];
    contacts: Contact[];
    crewCallTimes: CallTime[];
    castCallTimes: CallTime[];
    generalNotes: string;
  }>().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const teamMembers = pgTable('team_members', {
  id: text('id').primaryKey().notNull(),
  projectId: text('project_id'),
  name: text('name').notNull(),
  role: text('role'),
  email: text('email'),
  phone: text('phone'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Insert schemas for validation
export const insertProjectSchema = createInsertSchema(projects).omit({
  createdAt: true,
  updatedAt: true,
}).extend({ id: z.string().optional() });

export const insertCallSheetSchema = createInsertSchema(callSheets).omit({
  createdAt: true,
  updatedAt: true,
}).extend({ id: z.string().optional() });

export const insertTemplateSchema = createInsertSchema(templates).omit({
  createdAt: true,
  updatedAt: true,
}).extend({ id: z.string().optional() });

export const insertTeamMemberSchema = teamMemberSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type Location = z.infer<typeof locationSchema>;
export type Scene = z.infer<typeof sceneSchema>;
export type Contact = z.infer<typeof contactSchema>;
export type CallTime = z.infer<typeof callTimeSchema>;
export type Attachment = z.infer<typeof attachmentSchema>;
export type Project = z.infer<typeof projectSchema>;
export type CallSheet = z.infer<typeof callSheetSchema>;
export type Template = z.infer<typeof templateSchema>;
export type TeamMember = z.infer<typeof teamMemberSchema>;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type InsertCallSheet = z.infer<typeof insertCallSheetSchema>;
export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type SelectProject = typeof projects.$inferSelect;
export type SelectCallSheet = typeof callSheets.$inferSelect;
export type SelectTemplate = typeof templates.$inferSelect;
export type SelectTeamMember = typeof teamMembers.$inferSelect;
