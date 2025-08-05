import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCallSheetSchema, insertTemplateSchema, insertProjectSchema, insertTeamMemberSchema } from "@shared/schema";
import { testConnection } from "./db";
import { asyncHandler } from "./async-handler";

export async function registerRoutes(app: Express): Promise<Server> {
  // Test database connection on startup
  const connected = await testConnection();
  if (!connected) {
    console.warn('❌ Unable to connect to the database. Falling back to in-memory storage.');
  }
  // Call Sheet routes
    app.get("/api/call-sheets", asyncHandler(async (_req, res) => {
      const callSheets = await storage.listCallSheets();
      res.json(callSheets);
    }));

    app.get("/api/call-sheets/:id", asyncHandler(async (req, res) => {
      const { id } = req.params;
      const callSheet = await storage.getCallSheet(id);

      if (!callSheet) {
        return res.status(404).json({ error: "Call sheet not found" });
      }

      res.json(callSheet);
    }));

    app.post("/api/call-sheets", asyncHandler(async (req, res) => {
      const validatedData = insertCallSheetSchema.parse(req.body);
      const callSheet = await storage.createCallSheet(validatedData);
      res.status(201).json(callSheet);
    }));

    app.put("/api/call-sheets/:id", asyncHandler(async (req, res) => {
      const { id } = req.params;
      const validatedData = insertCallSheetSchema.partial().parse(req.body);
      const callSheet = await storage.updateCallSheet(id, validatedData);

      if (!callSheet) {
        return res.status(404).json({ error: "Call sheet not found" });
      }

      res.json(callSheet);
    }));

    app.delete("/api/call-sheets/:id", asyncHandler(async (req, res) => {
      const { id } = req.params;
      const success = await storage.deleteCallSheet(id);

      if (!success) {
        return res.status(404).json({ error: "Call sheet not found" });
      }

      res.status(204).send();
    }));

  // Project routes
    app.get("/api/projects", asyncHandler(async (_req, res) => {
      const projects = await storage.listProjects();
      res.json(projects);
    }));

    app.get("/api/projects/:id", asyncHandler(async (req, res) => {
      const { id } = req.params;
      const project = await storage.getProject(id);

      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      res.json(project);
    }));

    app.post("/api/projects", asyncHandler(async (req, res) => {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    }));

    app.put("/api/projects/:id", asyncHandler(async (req, res) => {
      const { id } = req.params;
      const validatedData = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(id, validatedData);

      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      res.json(project);
    }));

    app.delete("/api/projects/:id", asyncHandler(async (req, res) => {
      const { id } = req.params;
      const success = await storage.deleteProject(id);

      if (!success) {
        return res.status(404).json({ error: "Project not found" });
      }

      res.status(204).send();
    }));

  // Team member routes
    app.get("/api/team-members", asyncHandler(async (_req, res) => {
      const members = await storage.listTeamMembers();
      res.json(members);
    }));

    app.post("/api/team-members", asyncHandler(async (req, res) => {
      const validatedData = insertTeamMemberSchema.parse(req.body);
      const member = await storage.createTeamMember(validatedData);
      res.status(201).json(member);
    }));

    app.put("/api/team-members/:id", asyncHandler(async (req, res) => {
      const { id } = req.params;
      const validatedData = insertTeamMemberSchema.partial().parse(req.body);
      const member = await storage.updateTeamMember(id, validatedData);

      if (!member) {
        return res.status(404).json({ error: "Team member not found" });
      }

      res.json(member);
    }));

    app.delete("/api/team-members/:id", asyncHandler(async (req, res) => {
      const { id } = req.params;
      const success = await storage.deleteTeamMember(id);

      if (!success) {
        return res.status(404).json({ error: "Team member not found" });
      }

      res.status(204).send();
    }));

  // Template routes
    app.get("/api/templates", asyncHandler(async (req, res) => {
      const { category } = req.query;
      let templates;

      if (category) {
        templates = await storage.getTemplatesByCategory(category as string);
      } else {
        templates = await storage.listTemplates();
      }

      res.json(templates);
    }));

    app.get("/api/templates/defaults", asyncHandler(async (_req, res) => {
      const templates = await storage.getDefaultTemplates();
      res.json(templates);
    }));

    app.get("/api/templates/:id", asyncHandler(async (req, res) => {
      const { id } = req.params;
      const template = await storage.getTemplate(id);

      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }

      res.json(template);
    }));

    app.post("/api/templates", asyncHandler(async (req, res) => {
      const validatedData = insertTemplateSchema.parse(req.body);
      const template = await storage.createTemplate(validatedData);
      res.status(201).json(template);
    }));

    app.put("/api/templates/:id", asyncHandler(async (req, res) => {
      const { id } = req.params;
      const validatedData = insertTemplateSchema.partial().parse(req.body);
      const template = await storage.updateTemplate(id, validatedData);

      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }

      res.json(template);
    }));

    app.delete("/api/templates/:id", asyncHandler(async (req, res) => {
      const { id } = req.params;
      const success = await storage.deleteTemplate(id);

      if (!success) {
        return res.status(404).json({ error: "Template not found" });
      }

      res.status(204).send();
    }));

  const httpServer = createServer(app);
  return httpServer;
}
