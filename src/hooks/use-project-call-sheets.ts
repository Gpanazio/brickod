import { useState, useEffect } from "react";
import { CallSheet } from "@shared/schema";
import { nanoid } from "nanoid";

const STORAGE_KEY = "brick-project-call-sheets";

export function useProjectCallSheets(projectId?: string) {
  const [callSheets, setCallSheets] = useState<CallSheet[]>([]);

  useEffect(() => {
    loadFromStorage();
  }, [projectId]);

  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const allCallSheets = JSON.parse(stored);
        if (projectId) {
          // Filter call sheets by project
          const projectCallSheets = allCallSheets.filter(
            (cs: CallSheet) => cs.projectId === projectId
          );
          setCallSheets(projectCallSheets);
        } else {
          setCallSheets(allCallSheets);
        }
        return true;
      }
    } catch (error) {
      console.error("Error loading project call sheets from storage:", error);
    }
    return false;
  };

  const saveCallSheet = (callSheet: CallSheet) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const allCallSheets = stored ? JSON.parse(stored) : [];
      
      const callSheetWithProject = {
        ...callSheet,
        id: callSheet.id || nanoid(),
        projectId: projectId,
        updatedAt: new Date().toISOString(),
      };

      // Find existing call sheet or add new one
      const existingIndex = allCallSheets.findIndex((cs: CallSheet) => cs.id === callSheetWithProject.id);
      
      if (existingIndex >= 0) {
        allCallSheets[existingIndex] = callSheetWithProject;
      } else {
        allCallSheets.push(callSheetWithProject);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(allCallSheets));
      
      // Update local state if this call sheet belongs to current project
      if (projectId) {
        loadFromStorage();
      }
      
      return callSheetWithProject;
    } catch (error) {
      console.error("Error saving call sheet to storage:", error);
      return null;
    }
  };

  const duplicateCallSheet = (cs: CallSheet, title: string) => {
    return saveCallSheet({ ...cs, id: undefined, productionTitle: title });
  };

  const deleteCallSheet = (id: string) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const allCallSheets = stored ? JSON.parse(stored) : [];
      
      const updatedCallSheets = allCallSheets.filter((cs: CallSheet) => cs.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCallSheets));
      
      // Refresh local state
      loadFromStorage();
      
      return true;
    } catch (error) {
      console.error("Error deleting call sheet:", error);
      return false;
    }
  };

  const updateCallSheetStatus = (id: string, status: 'rascunho' | 'finalizada') => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const allCallSheets = stored ? JSON.parse(stored) : [];
      
      const updatedCallSheets = allCallSheets.map((cs: CallSheet) => 
        cs.id === id 
          ? { ...cs, status, updatedAt: new Date().toISOString() }
          : cs
      );
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCallSheets));
      loadFromStorage();
      
      return true;
    } catch (error) {
      console.error("Error updating call sheet status:", error);
      return false;
    }
  };

  return {
    callSheets,
    saveCallSheet,
    duplicateCallSheet,
    deleteCallSheet,
    updateCallSheetStatus,
    refreshCallSheets: loadFromStorage,
  };
}