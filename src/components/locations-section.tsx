import { MapPin, Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Location } from "@shared/schema";
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

interface LocationsSectionProps {
  locations: Location[];
  onAdd: () => void;
  onUpdate: (id: string, updates: Partial<Location>) => void;
  onRemove: (id: string) => void;
  onReorder: (locations: Location[]) => void;
}

interface SortableLocationItemProps {
  location: Location;
  index: number;
  onUpdate: (id: string, updates: Partial<Location>) => void;
  onRemove: (id: string) => void;
}

function SortableLocationItem({ location, index, onUpdate, onRemove }: SortableLocationItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: location.id });

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
          <h3 className="font-medium text-gray-900">Locação #{index + 1}</h3>
        </div>
        <Button
          onClick={() => onRemove(location.id)}
          variant="iconDestructive"
          size="sm"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="block text-sm font-medium text-gray-600 mb-1">
            Endereço
          </Label>
          <Input
            type="text"
            value={location.address}
            onChange={(e) => onUpdate(location.id, { address: e.target.value })}
            placeholder="Endereço completo da locação"
          />
        </div>
        <div>
          <Label className="block text-sm font-medium text-gray-600 mb-1">
            Observações
          </Label>
          <Input
            type="text"
            value={location.notes || ''}
            onChange={(e) => onUpdate(location.id, { notes: e.target.value })}
            placeholder="Informações adicionais"
          />
        </div>
      </div>
    </div>
  );
}

export default function LocationsSection({ 
  locations, 
  onAdd, 
  onUpdate, 
  onRemove,
  onReorder
}: LocationsSectionProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = locations.findIndex((location) => location.id === active.id);
      const newIndex = locations.findIndex((location) => location.id === over?.id);
      
      const reorderedLocations = arrayMove(locations, oldIndex, newIndex);
      onReorder(reorderedLocations);
    }
  }
  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-[var(--brick-dark)] rounded-lg flex items-center justify-center mr-3">
              <MapPin className="text-white w-4 h-4" />
            </div>
            <h2 className="text-xl font-semibold text-[var(--brick-dark)]">Locações</h2>
          </div>
          <Button
            onClick={onAdd}
            variant="brick"
            className="text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Locação
          </Button>
        </div>

        {locations.length === 0 ? (
          <div className="text-center py-8 text-gray-500 italic">
            Clique em "Nova Locação" para adicionar locações
          </div>
        ) : (
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={locations.map(location => location.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {locations.map((location, index) => (
                  <SortableLocationItem
                    key={location.id}
                    location={location}
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
