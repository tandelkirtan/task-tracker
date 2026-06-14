import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Calendar, Trash2, Edit2, MoreVertical } from 'lucide-react';
import type { Task, Status } from '../types';
import { cn } from '../utils';

interface TaskCardProps {
  task: Task;
  index: number;
  onDelete?: (id: string) => void;
  onEdit?: (task: Task) => void;
  onStatusChange?: (id: string, status: Status) => void;
  isAnimating?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, index, onDelete, onEdit, onStatusChange, isAnimating }) => {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowStatusDropdown(false);
      }
    };

    if (showStatusDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStatusDropdown]);

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

  const statusOptions: Status[] = (['TODO', 'IN-PROGRESS', 'DONE'] as Status[]).filter(status => status !== task.status);

  const handleStatusChange = (newStatus: Status) => {
    onStatusChange?.(task.id, newStatus);
    setShowStatusDropdown(false);
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
            snapshot.isDragging ? "shadow-2xl ring-4 ring-accent/20 scale-[1.02] z-50 rotate-1" : "hover:shadow-xl hover:border-accent/40 hover:-translate-y-0.5",
            isAnimating && "lg:hidden animate-pulse scale-95 opacity-50"
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
            <div className="flex items-center gap-1 shrink-0 ml-2 relative">
              {/* Status Dropdown Button - Always visible on mobile, on hover on desktop */}
              <button 
                onClick={(e) => { e.stopPropagation(); setShowStatusDropdown(!showStatusDropdown); }}
                className="p-2 text-text-muted hover:text-accent hover:bg-accent/10 rounded-xl transition-all lg:opacity-0 lg:group-hover:opacity-100 hover:scale-110"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {/* Status Dropdown Menu */}
              {showStatusDropdown && (
                <div ref={dropdownRef} className="absolute right-0 top-full mt-1 bg-bg-card border border-border-main rounded-xl shadow-xl z-50 min-w-[140px] overflow-hidden">
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      onClick={(e) => { e.stopPropagation(); handleStatusChange(status); }}
                      className={cn(
                        "w-full px-4 py-2.5 text-left text-xs font-bold transition-colors flex items-center gap-2",
                        task.status === status 
                          ? "bg-accent/10 text-accent" 
                          : "text-text-muted hover:text-text-primary hover:bg-bg-input"
                      )}
                    >
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        status === 'TODO' ? "bg-brand-blue" : 
                        status === 'IN-PROGRESS' ? "bg-brand-yellow" : "bg-brand-green"
                      )} />
                      {status.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              )}

              {task.status !== 'DONE' && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onEdit?.(task); }}
                  className="p-2 text-text-muted hover:text-accent hover:bg-accent/10 rounded-xl transition-all lg:opacity-0 lg:group-hover:opacity-100 hover:scale-110"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete?.(task.id); }}
                className="p-2 text-text-muted hover:text-brand-red hover:bg-brand-red/10 rounded-xl transition-all lg:opacity-0 lg:group-hover:opacity-100 hover:scale-110"
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
