import { useState, useEffect } from "react";
import { Project } from "@shared/schema";
import { nanoid } from "nanoid";

const STORAGE_KEY = "brick-projects";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    loadFromStorage();
  }, []);

  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setProjects(parsed);
        return true;
      }
    } catch (error) {
      console.error("Error loading projects from storage:", error);
    }
    return false;
  };

  const saveToStorage = (updatedProjects: Project[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProjects));
      return true;
    } catch (error) {
      console.error("Error saving projects to storage:", error);
      return false;
    }
  };

  const addProject = (name: string, description?: string, client?: string) => {
    const newProject: Project = {
      id: nanoid(),
      name,
      description: description || "",
      client: client || "",
      status: 'ativo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    saveToStorage(updatedProjects);
    return newProject;
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    const updatedProjects = projects.map(project => 
      project.id === id 
        ? { ...project, ...updates, updatedAt: new Date().toISOString() }
        : project
    );
    setProjects(updatedProjects);
    saveToStorage(updatedProjects);
  };

  const deleteProject = (id: string) => {
    const updatedProjects = projects.filter(project => project.id !== id);
    setProjects(updatedProjects);
    saveToStorage(updatedProjects);
  };

  const getProject = (id: string) => {
    return projects.find(project => project.id === id);
  };

  return {
    projects,
    addProject,
    updateProject,
    deleteProject,
    getProject,
    refreshProjects: loadFromStorage,
  };
}