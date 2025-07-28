import { useEffect, useState } from "react";
import { StickyNote, Save, FileText, Eye, Layers, History, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { useToast } from "@/hooks/use-toast";
import { useCallSheet } from "@/hooks/use-call-sheet";
import { useCreateCallSheet } from "@/hooks/use-call-sheet-history";
import { useCreateTemplate } from "@/hooks/use-templates";
import { generateCallSheetPDF } from "@/lib/pdf-generator";

import BrickHeader from "@/components/brick-header";
import BrickFooter from "@/components/brick-footer";
import ProductionInfo from "@/components/production-info";
import ScriptSection from "@/components/script-section";
import LocationsSection from "@/components/locations-section";
import ScenesSection from "@/components/scenes-section";
import CallTimesSection from "@/components/call-times-section";
import ContactsSection from "@/components/contacts-section";
import PDFPreviewDemo from "@/components/pdf-preview-demo";
import { TemplateManager } from "@/components/template-manager";
import { CallSheetHistory } from "@/components/call-sheet-history";
import type { CallSheet } from "@shared/schema";

export default function CallSheetGenerator() {
  const { toast } = useToast();
  const [showPreview, setShowPreview] = useState(false);

  const [activeTab, setActiveTab] = useState("form");
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [templateCategory, setTemplateCategory] = useState("produção");
  
  const createCallSheet = useCreateCallSheet();
  const createTemplateMutation = useCreateTemplate();
  const {
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
    saveCallSheet,
    clearCallSheet,
    replaceCallSheet,
  } = useCallSheet();

  const handleSave = async () => {
    try {
      const callSheetData = {
        ...callSheet,
        createdAt: callSheet.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      await createCallSheet.mutateAsync(callSheetData);
      
      // Also save locally as backup
      saveCallSheet();
      
      toast({
        title: "OD salva",
        description: "Sua ordem do dia foi salva com sucesso!",
      });
    } catch (error) {
      // Fallback to local storage if database save fails
      const success = saveCallSheet();
      if (success) {
        toast({
          title: "Salvo localmente",
          description: "Dados salvos no navegador (backup local).",
        });
      } else {
        toast({
          title: "Erro ao salvar",
          description: "Não foi possível salvar os dados.",
          variant: "destructive",
        });
      }
    }
  };

  const handleLoadFromHistory = (selectedCallSheet: CallSheet) => {
    replaceCallSheet(selectedCallSheet);
    setActiveTab("form");
    toast({
      title: "OD carregada",
      description: "A ordem do dia foi carregada com sucesso!",
    });
  };

  const handleExportPDF = () => {
    try {
      generateCallSheetPDF(callSheet);
      toast({
        title: "PDF gerado",
        description: "O mapa de filmagem foi gerado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao gerar PDF",
        description: "Não foi possível gerar o arquivo PDF. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleSaveAsTemplate = async () => {
    if (!templateName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, informe um nome para o template.",
        variant: "destructive",
      });
      return;
    }

    try {
      const templateData = {
        name: templateName,
        description: templateDescription,
        category: templateCategory,
        isDefault: false,
        templateData: {
          productionTitle: callSheet.productionTitle,
          producer: callSheet.producer,
          director: callSheet.director,
          client: callSheet.client,
          locations: callSheet.locations,  
          scenes: callSheet.scenes,
          contacts: callSheet.contacts,
          crewCallTimes: callSheet.crewCallTimes,
          castCallTimes: callSheet.castCallTimes,
          generalNotes: callSheet.generalNotes,
        },
      };

      await createTemplateMutation.mutateAsync(templateData);
      
      toast({
        title: "Template salvo",
        description: "Seu template foi criado com sucesso!",
      });
      
      // Reset form and close dialog
      setTemplateName("");
      setTemplateDescription("");
      setTemplateCategory("produção");
      setShowTemplateDialog(false);
    } catch (error) {
      toast({
        title: "Erro ao salvar template",
        description: "Não foi possível salvar o template. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Auto-save every 30 seconds if there are unsaved changes
  useEffect(() => {
    if (hasUnsavedChanges) {
      const autoSaveTimer = setTimeout(() => {
        saveCallSheet();
      }, 30000);

      return () => clearTimeout(autoSaveTimer);
    }
  }, [hasUnsavedChanges, saveCallSheet]);

  if (showPreview) {
    return (
      <div className="min-h-screen brick-light font-inter text-brick-dark">
        <BrickHeader 
          onExportPDF={handleExportPDF}
          onSave={handleSave}
          hasUnsavedChanges={hasUnsavedChanges}
        />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PDFPreviewDemo onClose={() => setShowPreview(false)} />
        </main>
        <BrickFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen brick-light font-inter text-brick-dark">
      <BrickHeader 
        onExportPDF={handleExportPDF}
        onSave={handleSave}
        hasUnsavedChanges={hasUnsavedChanges}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="form" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Nova OD
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Layout className="w-4 h-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              Histórico
            </TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="space-y-8">
            <ProductionInfo
              productionTitle={callSheet.productionTitle}
              shootingDate={callSheet.shootingDate}
              producer={callSheet.producer}
              director={callSheet.director}
              client={callSheet.client}
              onUpdateField={updateField}
            />

        <ScriptSection
          scriptUrl={callSheet.scriptUrl || ''}
          scriptName={callSheet.scriptName || ''}
          onUpdateField={updateField}
        />

        <LocationsSection
          locations={callSheet.locations}
          onAdd={addLocation}
          onUpdate={updateLocation}
          onRemove={removeLocation}
          onReorder={reorderLocations}
        />

        <ScenesSection
          scenes={callSheet.scenes}
          onAdd={addScene}
          onUpdate={updateScene}
          onRemove={removeScene}
          onReorder={reorderScenes}
        />

        <CallTimesSection
          crewCallTimes={callSheet.crewCallTimes}
          castCallTimes={callSheet.castCallTimes}
          startTime={callSheet.startTime}
          lunchBreakTime={callSheet.lunchBreakTime}
          endTime={callSheet.endTime}
          onAddCrew={addCrewCallTime}
          onUpdateCrew={updateCrewCallTime}
          onRemoveCrew={removeCrewCallTime}
          onAddCast={addCastCallTime}
          onUpdateCast={updateCastCallTime}
          onRemoveCast={removeCastCallTime}
          onUpdateField={updateField}
        />

        {/* General Notes Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 brick-dark rounded-lg flex items-center justify-center mr-3">
                <StickyNote className="text-white w-4 h-4" />
              </div>
              <h2 className="text-xl font-semibold text-brick-dark">Observações Gerais</h2>
            </div>
            
            <Textarea
              value={callSheet.generalNotes}
              onChange={(e) => updateField('generalNotes', e.target.value)}
              placeholder="Informações importantes para toda a equipe: condições climáticas, equipamentos especiais, restrições de acesso, contatos de emergência, etc."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brick-red focus:border-transparent transition-all h-32 resize-none"
            />
          </CardContent>
        </Card>

        <ContactsSection
          contacts={callSheet.contacts}
          onAdd={addContact}
          onUpdate={updateContact}
          onRemove={removeContact}
          onReorder={reorderContacts}
        />

        {/* Action Buttons */}
        <section className="flex justify-center gap-4 py-8">
          <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="border-brick-red text-brick-red hover:bg-brick-red hover:text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center text-lg"
              >
                <Layout className="w-5 h-5 mr-2" />
                Salvar como Template
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Salvar como Template</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="template-name">Nome do Template *</Label>
                  <Input
                    id="template-name"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="Ex: Template Comercial Básico"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="template-description">Descrição</Label>
                  <Textarea
                    id="template-description"
                    value={templateDescription}
                    onChange={(e) => setTemplateDescription(e.target.value)}
                    placeholder="Breve descrição do template (opcional)"
                    className="mt-1"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="template-category">Categoria</Label>
                  <select
                    id="template-category"
                    value={templateCategory}
                    onChange={(e) => setTemplateCategory(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brick-red focus:border-transparent"
                  >
                    <option value="produção">Produção</option>
                    <option value="comercial">Comercial</option>
                    <option value="documentário">Documentário</option>
                    <option value="evento">Evento</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowTemplateDialog(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSaveAsTemplate}
                    disabled={createTemplateMutation.isPending}
                    className="brick-red brick-red-hover"
                  >
                    {createTemplateMutation.isPending ? "Salvando..." : "Salvar Template"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button
            onClick={handleExportPDF}
            className="brick-red brick-red-hover text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center text-lg"
          >
            <FileText className="w-5 h-5 mr-2" />
            Gerar PDF
          </Button>
        </section>
          </TabsContent>

          <TabsContent value="templates">
            <TemplateManager
              onSelectTemplate={replaceCallSheet}
              currentCallSheet={callSheet}
            />
          </TabsContent>

          <TabsContent value="history">
            <CallSheetHistory onSelectCallSheet={handleLoadFromHistory} />
          </TabsContent>
        </Tabs>
      </main>

      <BrickFooter />
    </div>
  );
}
