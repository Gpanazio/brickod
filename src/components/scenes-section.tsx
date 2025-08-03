import { Video, Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Scene } from "@shared/schema";
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

interface ScenesSectionProps {
  scenes: Scene[];
  onAdd: () => void;
  onUpdate: (id: string, updates: Partial<Scene>) => void;
  onRemove: (id: string) => void;
  onReorder: (scenes: Scene[]) => void;
}

interface SortableSceneItemProps {
  scene: Scene;
  index: number;
  onUpdate: (id: string, updates: Partial<Scene>) => void;
  onRemove: (id: string) => void;
}

function SortableSceneItem({ scene, index, onUpdate, onRemove }: SortableSceneItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: scene.id });

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
          <h3 className="font-medium text-gray-900">Cena #{index + 1}</h3>
        </div>
        <Button
          onClick={() => onRemove(scene.id)}
          variant="iconGhost"
          size="sm"
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Label className="block text-sm font-medium text-gray-600 mb-1">
            Número da Cena
          </Label>
          <Input
            type="text"
            value={scene.number}
            onChange={(e) => onUpdate(scene.id, { number: e.target.value })}
            placeholder="Ex: 1A, 2B, 15"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brick-red focus:border-transparent text-sm"
          />
        </div>
        <div className="md:col-span-2">
          <Label className="block text-sm font-medium text-gray-600 mb-1">
            Descrição
          </Label>
          <Input
            type="text"
            value={scene.description}
            onChange={(e) => onUpdate(scene.id, { description: e.target.value })}
            placeholder="Breve descrição da cena"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brick-red focus:border-transparent text-sm"
          />
        </div>
        <div>
          <Label className="block text-sm font-medium text-gray-600 mb-1">
            Tempo Estimado
          </Label>
          <Input
            type="text"
            value={scene.estimatedTime || ''}
            onChange={(e) => onUpdate(scene.id, { estimatedTime: e.target.value })}
            placeholder="Ex: 2h, 30min"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brick-red focus:border-transparent text-sm"
          />
        </div>
      </div>
      <div className="mt-4">
        <Label className="block text-sm font-medium text-gray-600 mb-1">
          Elenco da Cena
        </Label>
        <Textarea
          value={scene.cast}
          onChange={(e) => onUpdate(scene.id, { cast: e.target.value })}
          placeholder="Liste os atores necessários para esta cena"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brick-red focus:border-transparent text-sm h-20 resize-none"
        />
      </div>
    </div>
  );
}

export default function ScenesSection({ 
  scenes, 
  onAdd, 
  onUpdate, 
  onRemove,
  onReorder
}: ScenesSectionProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = scenes.findIndex((scene) => scene.id === active.id);
      const newIndex = scenes.findIndex((scene) => scene.id === over?.id);
      
      const reorderedScenes = arrayMove(scenes, oldIndex, newIndex);
      onReorder(reorderedScenes);
    }
  }
  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-8 h-8 brick-dark rounded-lg flex items-center justify-center mr-3">
              <Video className="text-white w-4 h-4" />
            </div>
            <h2 className="text-xl font-semibold text-brick-dark">Cenas Programadas</h2>
          </div>
          <Button
            onClick={onAdd}
            variant="brick"
            className="text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Cena
          </Button>
        </div>

        {scenes.length === 0 ? (
          <div className="text-center py-8 text-gray-500 italic">
            Clique em "Nova Cena" para adicionar cenas ao roteiro
          </div>
        ) : (
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={scenes.map(scene => scene.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {scenes.map((scene, index) => (
                  <SortableSceneItem
                    key={scene.id}
                    scene={scene}
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
