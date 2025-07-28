import jsPDF from "jspdf";
import { CallSheet } from "@shared/schema";

export function generateCallSheetPDF(callSheet: CallSheet) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 15;
  const blockSpacing = 10;
  
  // Helper function to create section blocks
  const createSectionBlock = (title: string, yPos: number, height: number = 8) => {
    // Check if we need a new page
    if (yPos + height > pageHeight - 20) {
      doc.addPage();
      yPos = 20;
    }
    
    // Background block
    doc.setFillColor(245, 245, 245);
    doc.rect(margin, yPos - 2, pageWidth - (margin * 2), height, 'F');
    
    // Border
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.rect(margin, yPos - 2, pageWidth - (margin * 2), height);
    
    // Section title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(title, margin + 3, yPos + 3);
    
    return yPos + height + 3;
  };
  
  // Helper function to add content lines
  const addContentLine = (label: string, value: string, yPos: number, indent: number = 3) => {
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(label, margin + indent, yPos);
    doc.setFont("helvetica", "normal");
    const labelWidth = doc.getTextWidth(label);
    doc.text(value, margin + indent + labelWidth + 2, yPos);
    return yPos + 6;
  };
  
  // Header Block
  doc.setFillColor(0, 0, 0);
  doc.rect(0, 0, pageWidth, 28, 'F');
  
  // Brick Logo
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("BRICK", margin, 14);
  
  // Title
  doc.setFontSize(16);
  doc.text("ORDEM DO DIA", margin, 22);
  
  // Date in header
  doc.setFontSize(8);
  doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, pageWidth - 50, 14);
  
  let yPosition = 40;
  
  // Production Info Block
  yPosition = createSectionBlock("INFORMAÇÕES DA PRODUÇÃO", yPosition, 10);
  yPosition = addContentLine("Produção:", callSheet.productionTitle || "Não informado", yPosition);
  yPosition = addContentLine("Data:", callSheet.shootingDate || "Não informado", yPosition);
  if (callSheet.scriptName) {
    yPosition = addContentLine("Roteiro:", callSheet.scriptName, yPosition);
  }
  yPosition += blockSpacing;
  
  // Locations Block
  if (callSheet.locations.length > 0) {
    yPosition = createSectionBlock("LOCAÇÕES", yPosition, 8);
    callSheet.locations.forEach((location, index) => {
      yPosition = addContentLine(`Locação ${index + 1}:`, location.address, yPosition);
      if (location.notes) {
        doc.setFontSize(8);
        doc.setFont("helvetica", "italic");
        doc.text(`Obs: ${location.notes}`, margin + 6, yPosition);
        yPosition += 5;
      }
    });
    yPosition += blockSpacing;
  }
  
  // Scenes Block
  if (callSheet.scenes.length > 0) {
    yPosition = createSectionBlock("CENAS", yPosition, 8);
    callSheet.scenes.forEach((scene) => {
      yPosition = addContentLine(`Cena ${scene.number}:`, scene.description, yPosition);
      if (scene.cast) {
        yPosition = addContentLine("Elenco:", scene.cast, yPosition);
      }
    });
    yPosition += blockSpacing;
  }
  
  // Call Times Block - Crew
  if (callSheet.crewCallTimes.length > 0) {
    yPosition = createSectionBlock("HORÁRIOS DA EQUIPE", yPosition, 8);
    callSheet.crewCallTimes.forEach((callTime) => {
      yPosition = addContentLine(`${callTime.time}:`, `${callTime.name} - ${callTime.role}`, yPosition);
    });
    yPosition += blockSpacing;
  }
  
  // Call Times Block - Cast
  if (callSheet.castCallTimes.length > 0) {
    yPosition = createSectionBlock("HORÁRIOS DO ELENCO", yPosition, 8);
    callSheet.castCallTimes.forEach((callTime) => {
      yPosition = addContentLine(`${callTime.time}:`, `${callTime.name} - ${callTime.role}`, yPosition);
    });
    yPosition += blockSpacing;
  }
  
  // Contacts Block
  if (callSheet.contacts.length > 0) {
    yPosition = createSectionBlock("CONTATOS", yPosition, 8);
    callSheet.contacts.forEach((contact) => {
      yPosition = addContentLine(`${contact.name} (${contact.role}):`, contact.phone, yPosition);
    });
    yPosition += blockSpacing;
  }
  
  // General Notes Block
  if (callSheet.generalNotes) {
    yPosition = createSectionBlock("OBSERVAÇÕES GERAIS", yPosition, 8);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const splitNotes = doc.splitTextToSize(callSheet.generalNotes, pageWidth - margin * 2 - 6);
    doc.text(splitNotes, margin + 3, yPosition);
    yPosition += splitNotes.length * 5 + blockSpacing;
  }
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text("Brick Produtora - Produção Audiovisual", margin, pageHeight - 10);
  
  // Save the PDF
  doc.save(`ordem-do-dia-${callSheet.productionTitle || 'sem-titulo'}.pdf`);
}