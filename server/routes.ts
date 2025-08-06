import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCallSheetSchema, insertTemplateSchema, insertProjectSchema, insertTeamMemberSchema } from "@shared/schema";
import { testConnection } from "./db";
import { ZodError } from "zod";
import { logger } from "@shared/logger";

export async function registerRoutes(app: Express): Promise<Server> {
  // Test database connection on startup
  const connected = await testConnection();
  if (!connected) {
    logger.warn('❌ Unable to connect to the database. Falling back to in-memory storage.');
  }
  // Call Sheet routes
  app.get("/api/call-sheets", async (req, res) => {
    try {
      const callSheets = await storage.listCallSheets();
      res.json(callSheets);
    } catch (error) {
      logger.error("Route error fetching call sheets:", error);
      res.status(500).json({ error: "Failed to fetch call sheets" });
    }
  });

  app.get("/api/call-sheets/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const callSheet = await storage.getCallSheet(id);
      
      if (!callSheet) {
        return res.status(404).json({ error: "Call sheet not found" });
      }
      
      res.json(callSheet);
    } catch (error) {
      logger.error("Error fetching call sheet:", error);
      res.status(500).json({ error: "Failed to fetch call sheet" });
    }
  });

  app.post("/api/call-sheets", async (req, res) => {
    try {
      const validatedData = insertCallSheetSchema.parse(req.body);
      const callSheet = await storage.createCallSheet(validatedData);
      res.status(201).json(callSheet);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          error: "Validation error", 
          details: error.issues 
        });
      }
      logger.error("Error creating call sheet:", error);
      res.status(500).json({ error: "Failed to create call sheet" });
    }
  });

  app.put("/api/call-sheets/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertCallSheetSchema.partial().parse(req.body);
      const callSheet = await storage.updateCallSheet(id, validatedData);
      
      if (!callSheet) {
        return res.status(404).json({ error: "Call sheet not found" });
      }
      
      res.json(callSheet);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          error: "Validation error", 
          details: error.issues 
        });
      }
      logger.error("Error updating call sheet:", error);
      res.status(500).json({ error: "Failed to update call sheet" });
    }
  });

  app.delete("/api/call-sheets/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteCallSheet(id);
      
      if (!success) {
        return res.status(404).json({ error: "Call sheet not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      logger.error("Error deleting call sheet:", error);
      res.status(500).json({ error: "Failed to delete call sheet" });
    }
  });

  // Project routes
  app.get("/api/projects", async (_req, res) => {
    try {
      const projects = await storage.listProjects();
      res.json(projects);
    } catch (error) {
      logger.error("Route error fetching projects:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const project = await storage.getProject(id);

      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      res.json(project);
    } catch (error) {
      logger.error("Error fetching project:", error);
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "Validation error",
          details: error.issues
        });
      }
      logger.error("Error creating project:", error);
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  app.put("/api/projects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(id, validatedData);

      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      res.json(project);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "Validation error",
          details: error.issues
        });
      }
      logger.error("Error updating project:", error);
      res.status(500).json({ error: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteProject(id);

      if (!success) {
        return res.status(404).json({ error: "Project not found" });
      }

      res.status(204).send();
    } catch (error) {
      logger.error("Error deleting project:", error);
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  // Team member routes
  app.get("/api/team-members", async (_req, res) => {
    try {
      const members = await storage.listTeamMembers();
      res.json(members);
    } catch (error) {
      logger.error("Error fetching team members:", error);
      res.status(500).json({ error: "Failed to fetch team members" });
    }
  });

  app.post("/api/team-members", async (req, res) => {
    try {
      const validatedData = insertTeamMemberSchema.parse(req.body);
      const member = await storage.createTeamMember(validatedData);
      res.status(201).json(member);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "Validation error",
          details: error.issues
        });
      }
      logger.error("Error creating team member:", error);
      res.status(500).json({ error: "Failed to create team member" });
    }
  });

  app.put("/api/team-members/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertTeamMemberSchema.partial().parse(req.body);
      const member = await storage.updateTeamMember(id, validatedData);

      if (!member) {
        return res.status(404).json({ error: "Team member not found" });
      }

      res.json(member);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "Validation error",
          details: error.issues
        });
      }
      logger.error("Error updating team member:", error);
      res.status(500).json({ error: "Failed to update team member" });
    }
  });

  app.delete("/api/team-members/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteTeamMember(id);

      if (!success) {
        return res.status(404).json({ error: "Team member not found" });
      }

      res.status(204).send();
    } catch (error) {
      logger.error("Error deleting team member:", error);
      res.status(500).json({ error: "Failed to delete team member" });
    }
  });

  // Template routes
  app.get("/api/templates", async (req, res) => {
    try {
      const { category } = req.query;
      let templates;
      
      if (category) {
        templates = await storage.getTemplatesByCategory(category as string);
      } else {
        templates = await storage.listTemplates();
      }
      
      res.json(templates);
    } catch (error) {
      logger.error("Error fetching templates:", error);
      res.status(500).json({ error: "Failed to fetch templates" });
    }
  });

  app.get("/api/templates/defaults", async (req, res) => {
    try {
      const templates = await storage.getDefaultTemplates();
      res.json(templates);
    } catch (error) {
      logger.error("Error fetching default templates:", error);
      res.status(500).json({ error: "Failed to fetch default templates" });
    }
  });

  app.get("/api/templates/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const template = await storage.getTemplate(id);
      
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }
      
      res.json(template);
    } catch (error) {
      logger.error("Error fetching template:", error);
      res.status(500).json({ error: "Failed to fetch template" });
    }
  });

  app.post("/api/templates", async (req, res) => {
    try {
      const validatedData = insertTemplateSchema.parse(req.body);
      const template = await storage.createTemplate(validatedData);
      res.status(201).json(template);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          error: "Validation error", 
          details: error.issues 
        });
      }
      logger.error("Error creating template:", error);
      res.status(500).json({ error: "Failed to create template" });
    }
  });

  app.put("/api/templates/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertTemplateSchema.partial().parse(req.body);
      const template = await storage.updateTemplate(id, validatedData);
      
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }
      
      res.json(template);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          error: "Validation error", 
          details: error.issues 
        });
      }
      logger.error("Error updating template:", error);
      res.status(500).json({ error: "Failed to update template" });
    }
  });

  app.delete("/api/templates/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteTemplate(id);
      
      if (!success) {
        return res.status(404).json({ error: "Template not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      logger.error("Error deleting template:", error);
      res.status(500).json({ error: "Failed to delete template" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
