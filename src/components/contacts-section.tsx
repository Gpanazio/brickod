import { Users, Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Contact } from "@shared/schema";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ContactsSectionProps {
  contacts: Contact[];
  onAdd: () => void;
  onUpdate: (id: string, updates: Partial<Contact>) => void;
  onRemove: (id: string) => void;
  onReorder: (contacts: Contact[]) => void;
}

interface SortableContactItemProps {
  contact: Contact;
  index: number;
  onUpdate: (id: string, updates: Partial<Contact>) => void;
  onRemove: (id: string) => void;
}

function SortableContactItem({ contact, index, onUpdate, onRemove }: SortableContactItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: contact.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border border-gray-200 rounded-lg p-4 bg-white ${isDragging ? 'shadow-lg' : ''}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 p-1"
          >
            <GripVertical className="w-4 h-4" />
          </div>
          <h3 className="font-medium text-gray-900">Contato #{index + 1}</h3>
        </div>
        <Button
          onClick={() => onRemove(contact.id)}
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label className="block text-sm font-medium text-gray-600 mb-1">
            Nome
          </Label>
          <Input
            type="text"
            value={contact.name}
            onChange={(e) => onUpdate(contact.id, { name: e.target.value })}
            placeholder="Nome completo"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brick-red focus:border-transparent text-sm"
          />
        </div>
        <div>
          <Label className="block text-sm font-medium text-gray-600 mb-1">
            Cargo/Função
          </Label>
          <Input
            type="text"
            value={contact.role}
            onChange={(e) => onUpdate(contact.id, { role: e.target.value })}
            placeholder="ex: Diretor, Produtor, etc."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brick-red focus:border-transparent text-sm"
          />
        </div>
        <div>
          <Label className="block text-sm font-medium text-gray-600 mb-1">
            Telefone
          </Label>
          <Input
            type="tel"
            value={contact.phone}
            onChange={(e) => onUpdate(contact.id, { phone: e.target.value })}
            placeholder="(11) 99999-9999"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brick-red focus:border-transparent text-sm"
          />
        </div>
      </div>
    </div>
  );
}

export default function ContactsSection({ 
  contacts, 
  onAdd, 
  onUpdate, 
  onRemove,
  onReorder
}: ContactsSectionProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = contacts.findIndex((contact) => contact.id === active.id);
      const newIndex = contacts.findIndex((contact) => contact.id === over?.id);
      
      const reorderedContacts = arrayMove(contacts, oldIndex, newIndex);
      onReorder(reorderedContacts);
    }
  }

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-8 h-8 brick-dark rounded-lg flex items-center justify-center mr-3">
              <Users className="text-white w-4 h-4" />
            </div>
            <h2 className="text-xl font-semibold text-brick-dark">Contatos Importantes</h2>
          </div>
          <Button 
            onClick={onAdd}
            className="brick-red brick-red-hover text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Contato
          </Button>
        </div>

        {contacts.length === 0 ? (
          <div className="text-center py-8 text-gray-500 italic">
            Clique em "Novo Contato" para adicionar contatos importantes
          </div>
        ) : (
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={contacts.map(contact => contact.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {contacts.map((contact, index) => (
                  <SortableContactItem
                    key={contact.id}
                    contact={contact}
                    index={index}
                    onUpdate={onUpdate}
                    onRemove={onRemove}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </CardContent>
    </Card>
  );
}