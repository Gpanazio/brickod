import { useState, useEffect } from "react";
import { CallSheet, Location, Scene, Contact, CallTime, Attachment } from "@shared/schema";
import { nanoid } from "nanoid";

const STORAGE_KEY = "brick-call-sheet";

export function useCallSheet() {
  const [callSheet, setCallSheet] = useState<CallSheet>({
    id: nanoid(),
    productionTitle: "",
    shootingDate: "",
    producer: "",
    director: "",
    client: "",
    scriptUrl: "",
    scriptName: "",
    attachments: [],
    startTime: "",
    lunchBreakTime: "",
    endTime: "",
    locations: [],
    scenes: [],
    contacts: [],
    crewCallTimes: [],
    castCallTimes: [],
    generalNotes: "",
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    loadFromStorage();
  }, []);

  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [callSheet]);

  const updateField = (field: keyof CallSheet, value: any) => {
    setCallSheet(prev => ({
      ...prev,
      [field]: value,
      updatedAt: new Date().toISOString(),
    }));
  };

  const addLocation = () => {
    const newLocation: Location = {
      id: nanoid(),
      address: "",
      notes: "",
    };
    setCallSheet(prev => ({
      ...prev,
      locations: [...prev.locations, newLocation],
    }));
  };

  const updateLocation = (id: string, updates: Partial<Location>) => {
    setCallSheet(prev => ({
      ...prev,
      locations: prev.locations.map(loc => 
        loc.id === id ? { ...loc, ...updates } : loc
      ),
    }));
  };

  const removeLocation = (id: string) => {
    setCallSheet(prev => ({
      ...prev,
      locations: prev.locations.filter(loc => loc.id !== id),
    }));
  };

  const reorderLocations = (newLocations: Location[]) => {
    setCallSheet(prev => ({
      ...prev,
      locations: newLocations,
    }));
  };

  const addScene = () => {
    const newScene: Scene = {
      id: nanoid(),
      number: "",
      description: "",
      cast: "",
      estimatedTime: "",
    };
    setCallSheet(prev => ({
      ...prev,
      scenes: [...prev.scenes, newScene],
    }));
  };

  const updateScene = (id: string, updates: Partial<Scene>) => {
    setCallSheet(prev => ({
      ...prev,
      scenes: prev.scenes.map(scene => 
        scene.id === id ? { ...scene, ...updates } : scene
      ),
    }));
  };

  const removeScene = (id: string) => {
    setCallSheet(prev => ({
      ...prev,
      scenes: prev.scenes.filter(scene => scene.id !== id),
    }));
  };

  const reorderScenes = (newScenes: Scene[]) => {
    setCallSheet(prev => ({
      ...prev,
      scenes: newScenes,
    }));
  };

  const addContact = () => {
    const newContact: Contact = {
      id: nanoid(),
      name: "",
      role: "",
      phone: "",
    };
    setCallSheet(prev => ({
      ...prev,
      contacts: [...prev.contacts, newContact],
    }));
  };

  const updateContact = (id: string, updates: Partial<Contact>) => {
    setCallSheet(prev => ({
      ...prev,
      contacts: prev.contacts.map(contact => 
        contact.id === id ? { ...contact, ...updates } : contact
      ),
    }));
  };

  const removeContact = (id: string) => {
    setCallSheet(prev => ({
      ...prev,
      contacts: prev.contacts.filter(contact => contact.id !== id),
    }));
  };

  const reorderContacts = (newContacts: Contact[]) => {
    setCallSheet(prev => ({
      ...prev,
      contacts: newContacts,
    }));
  };

  const addCrewCallTime = () => {
    const newCallTime: CallTime = {
      id: nanoid(),
      time: "",
      name: "",
      role: "",
    };
    setCallSheet(prev => ({
      ...prev,
      crewCallTimes: [...prev.crewCallTimes, newCallTime],
    }));
  };

  const updateCrewCallTime = (id: string, updates: Partial<CallTime>) => {
    setCallSheet(prev => ({
      ...prev,
      crewCallTimes: prev.crewCallTimes.map(callTime => 
        callTime.id === id ? { ...callTime, ...updates } : callTime
      ),
    }));
  };

  const removeCrewCallTime = (id: string) => {
    setCallSheet(prev => ({
      ...prev,
      crewCallTimes: prev.crewCallTimes.filter(callTime => callTime.id !== id),
    }));
  };

  const addCastCallTime = () => {
    const newCallTime: CallTime = {
      id: nanoid(),
      time: "",
      name: "",
      role: "",
    };
    setCallSheet(prev => ({
      ...prev,
      castCallTimes: [...prev.castCallTimes, newCallTime],
    }));
  };

  const updateCastCallTime = (id: string, updates: Partial<CallTime>) => {
    setCallSheet(prev => ({
      ...prev,
      castCallTimes: prev.castCallTimes.map(callTime => 
        callTime.id === id ? { ...callTime, ...updates } : callTime
      ),
    }));
  };

  const removeCastCallTime = (id: string) => {
    setCallSheet(prev => ({
      ...prev,
      castCallTimes: prev.castCallTimes.filter(callTime => callTime.id !== id),
    }));
  };

  const addAttachment = (name: string, url: string, type: string) => {
    const newAttachment: Attachment = {
      id: nanoid(),
      name,
      url,
      type,
    };
    setCallSheet(prev => ({
      ...prev,
      attachments: [...prev.attachments, newAttachment],
    }));
  };

  const updateAttachment = (id: string, updates: Partial<Attachment>) => {
    setCallSheet(prev => ({
      ...prev,
      attachments: prev.attachments.map(attachment => 
        attachment.id === id ? { ...attachment, ...updates } : attachment
      ),
    }));
  };

  const removeAttachment = (id: string) => {
    setCallSheet(prev => ({
      ...prev,
      attachments: prev.attachments.filter(attachment => attachment.id !== id),
    }));
  };

  const saveToStorage = () => {
    try {
      const dataToSave = {
        ...callSheet,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      setHasUnsavedChanges(false);
      return true;
    } catch (error) {
      console.error("Error saving to storage:", error);
      return false;
    }
  };

  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setCallSheet(parsed);
        setHasUnsavedChanges(false);
        return true;
      }
    } catch (error) {
      console.error("Error loading from storage:", error);
    }
    return false;
  };

  const clearData = () => {
    setCallSheet({
      id: nanoid(),
      productionTitle: "",
      shootingDate: "",
      producer: "",
      director: "",
      client: "",
      scriptUrl: "",
      scriptName: "",
      attachments: [],
      startTime: "",
      lunchBreakTime: "",
      endTime: "",
      locations: [],
      scenes: [],
      contacts: [],
      crewCallTimes: [],
      castCallTimes: [],
      generalNotes: "",
    });
    setHasUnsavedChanges(false);
  };

  return {
    callSheet,
    hasUnsavedChanges,
    updateField,
    addLocation,
    updateLocation,
    removeLocation,
    reorderLocations,
    addScene,
    updateScene,
    removeScene,
    reorderScenes,
    addContact,
    updateContact,
    removeContact,
    reorderContacts,
    addCrewCallTime,
    updateCrewCallTime,
    removeCrewCallTime,
    addCastCallTime,
    updateCastCallTime,
    removeCastCallTime,
    addAttachment,
    updateAttachment,
    removeAttachment,
    saveCallSheet: saveToStorage,
    clearCallSheet: clearData,
    replaceCallSheet: (newCallSheet: CallSheet) => {
      setCallSheet({
        ...newCallSheet,
        id: nanoid(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setHasUnsavedChanges(true);
    },
  };
}
