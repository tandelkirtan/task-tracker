import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Calendar, Trash2, Edit2 } from 'lucide-react';
import type { Task } from '../types';
import { cn } from '../utils';

interface TaskCardProps {
  task: Task;
  index: number;
  onDelete?: (id: string) => void;
  onEdit?: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, index, onDelete, onEdit }) => {
  const priorityColors = {
    Low: 'bg-brand-green',
    Medium: 'bg-brand-blue',
    High: 'bg-brand-red',
  };

  const statusColors = {
    'TODO': 'border-brand-blue/30 bg-brand-blue/5',
    'IN-PROGRESS': 'border-brand-yellow/30 bg-brand-yellow/5',
    'DONE': 'border-brand-green/30 bg-brand-green/5',
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            "rounded-2xl p-5 mb-4 shadow-sm border transition-all duration-300 group relative overflow-hidden",
            statusColors[task.status],
            snapshot.isDragging ? "shadow-2xl ring-4 ring-accent/20 scale-[1.02] z-50 rotate-1" : "hover:shadow-xl hover:border-accent/40 hover:-translate-y-0.5"
          )}
        >
          <div className="absolute top-0 left-0 w-1 h-full rounded-l-lg opacity-30" 
               style={{ backgroundColor: task.status === 'TODO' ? 'var(--color-brand-blue)' : 
                                       task.status === 'IN-PROGRESS' ? 'var(--color-brand-yellow)' : 
                                       'var(--color-brand-green)' }} />
          
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <h3 className={cn(
                "font-bold text-text-primary text-[15px] leading-tight group-hover:text-accent transition-colors line-clamp-2",
                task.status === 'DONE' && "line-through opacity-50"
              )}>
                {task.title}
              </h3>
            </div>
            <div className="flex items-center gap-1 shrink-0 ml-2">
              {task.status !== 'DONE' && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onEdit?.(task); }}
                  className="p-2 text-text-muted hover:text-accent hover:bg-accent/10 rounded-xl transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete?.(task.id); }}
                className="p-2 text-text-muted hover:text-brand-red hover:bg-brand-red/10 rounded-xl transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {task.description && (
            <p className={cn(
              "text-[12px] text-text-muted mb-4 line-clamp-2 font-medium leading-relaxed",
              task.status === 'DONE' && "opacity-50"
            )}>
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-3 mt-auto pt-4 border-t border-border-main/30">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-bg-input rounded-xl border border-border-main/50 shadow-sm">
              <div className={cn("w-2.5 h-2.5 rounded-full shadow-sm", priorityColors[task.priority])} />
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{task.priority}</span>
            </div>
            <div className="flex items-center gap-1.5 text-text-muted">
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">{task.date}</span>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
