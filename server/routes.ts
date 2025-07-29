import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCallSheetSchema, insertTemplateSchema } from "@shared/schema";
import { testConnection } from "./db";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Test database connection on startup
  await testConnection();
  // Call Sheet routes
  app.get("/api/call-sheets", async (req, res) => {
    try {
      const callSheets = await storage.listCallSheets();
      res.json(callSheets);
    } catch (error) {
      console.error("Route error fetching call sheets:", error);
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
      console.error("Error fetching call sheet:", error);
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
      console.error("Error creating call sheet:", error);
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
      console.error("Error updating call sheet:", error);
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
      console.error("Error deleting call sheet:", error);
      res.status(500).json({ error: "Failed to delete call sheet" });
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
      console.error("Error fetching templates:", error);
      res.status(500).json({ error: "Failed to fetch templates" });
    }
  });

  app.get("/api/templates/defaults", async (req, res) => {
    try {
      const templates = await storage.getDefaultTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching default templates:", error);
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
      console.error("Error fetching template:", error);
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
      console.error("Error creating template:", error);
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
      console.error("Error updating template:", error);
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
      console.error("Error deleting template:", error);
      res.status(500).json({ error: "Failed to delete template" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
