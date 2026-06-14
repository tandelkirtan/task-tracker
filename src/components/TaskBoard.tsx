import React, { useState } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { Plus, Search } from 'lucide-react';
import type { Task, Column, Status } from '../types';
import TaskCard from './TaskCard';
import { cn } from '../utils';

interface TaskBoardProps {
  tasks: { [key: string]: Task };
  columns: { [key in Status]: Column };
  onDragEnd: (result: DropResult) => void;
  onAddTask: (status: Status) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onStatusChange?: (id: string, status: Status) => void;
}

const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, columns, onDragEnd, onAddTask, onDeleteTask, onEditTask, onStatusChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMobileColumn, setActiveMobileColumn] = useState<Status>(() => {
    const savedColumn = localStorage.getItem('activeMobileColumn');
    return savedColumn ? (savedColumn as Status) : 'TODO';
  });
  const [animatingTaskId, setAnimatingTaskId] = useState<string | null>(null);
  const columnOrder: Status[] = ['TODO', 'IN-PROGRESS', 'DONE'];
  const columnsContainerRef = React.useRef<HTMLDivElement>(null);

  // Save activeMobileColumn to localStorage
  React.useEffect(() => {
    localStorage.setItem('activeMobileColumn', activeMobileColumn);
  }, [activeMobileColumn]);

  // Scroll to saved column on mount
  React.useEffect(() => {
    const savedColumn = localStorage.getItem('activeMobileColumn');
    if (savedColumn) {
      setTimeout(() => {
        handleMobileColumnClick(savedColumn as Status);
      }, 100);
    }
  }, []);

  const getStatusColor = (status: Status) => {
    switch (status) {
      case 'TODO': return 'text-brand-blue bg-brand-blue/10';
      case 'IN-PROGRESS': return 'text-brand-yellow bg-brand-yellow/10';
      case 'DONE': return 'text-brand-green bg-brand-green/10';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const filteredTaskIds = (columnTaskIds: string[]) => {
    return columnTaskIds.filter(id => {
      const task = tasks[id];
      return task && task.title.toLowerCase().includes(searchQuery.toLowerCase());
    });
  };

  const handleMobileColumnClick = (columnId: Status) => {
    setActiveMobileColumn(columnId);
    const columnIndex = columnOrder.indexOf(columnId);
    const columnWidth = window.innerWidth < 1024 ? 320 : 380;
    const scrollPosition = columnIndex * columnWidth;
    if (columnsContainerRef.current) {
      columnsContainerRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleStatusChange = (id: string, newStatus: Status) => {
    // Check if we're on mobile
    const isMobile = window.innerWidth < 1024;
    
    if (isMobile) {
      // Set the animating task
      setAnimatingTaskId(id);
      
      // Call the original status change
      onStatusChange?.(id, newStatus);
      
      // Update the active mobile column
      setActiveMobileColumn(newStatus);
      
      // Scroll to the new column after a short delay
      setTimeout(() => {
        handleMobileColumnClick(newStatus);
        
        // Clear the animation state
        setTimeout(() => {
          setAnimatingTaskId(null);
        }, 500);
      }, 300);
    } else {
      // Just call the original status change on desktop
      onStatusChange?.(id, newStatus);
    }
  };

  return (
    <div className="px-4 lg:px-8 py-4 lg:py-6 flex flex-col h-full overflow-hidden">
      {/* Search and Add Task Row */}
      <div className="mb-6 lg:mb-8 hidden lg:flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-bg-card border border-border-main rounded-2xl shadow-md text-sm font-bold text-text-primary focus:ring-4 focus:ring-accent/10 focus:border-accent/30 transition-all outline-none placeholder:text-text-muted/50"
          />
        </div>
        <button 
          onClick={() => onAddTask('TODO')}
          className="bg-gradient-to-r from-brand-blue to-accent text-white px-6 lg:px-8 py-3 rounded-2xl font-bold text-sm hover:shadow-xl hover:shadow-brand-blue/20 transition-all active:scale-[0.98] whitespace-nowrap"
        >
          Add Task
        </button>
      </div>

      {/* Mobile Column Tabs */}
      <div className="lg:hidden mb-4 flex gap-2 overflow-x-auto pb-2">
        {columnOrder.map((columnId) => {
          const column = columns[columnId];
          const columnTaskIds = filteredTaskIds(column.taskIds);
          return (
            <button
              key={columnId}
              onClick={() => handleMobileColumnClick(columnId)}
              className={cn(
                "flex-shrink-0 px-4 py-2 rounded-xl font-bold text-xs border transition-all",
                activeMobileColumn === columnId
                  ? "bg-accent text-white border-accent shadow-md shadow-accent/20"
                  : "bg-bg-card text-text-primary border-border-main hover:bg-bg-input"
              )}
            >
              {column.title} ({columnTaskIds.length})
            </button>
          );
        })}
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div ref={columnsContainerRef} className="flex gap-4 lg:gap-8 flex-1 overflow-x-auto pb-4 lg:pb-6 custom-scrollbar">
          {columnOrder.map((columnId) => {
            const column = columns[columnId];
            const columnTaskIds = filteredTaskIds(column.taskIds);

            return (
              <div key={columnId} className="flex flex-col w-[320px] lg:w-[380px] min-w-[320px] lg:min-w-[380px]">
                <div className="flex items-center justify-between mb-4 lg:mb-6 px-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-text-primary tracking-tight text-base">{column.title}</h3>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[11px] font-bold shadow-sm",
                      getStatusColor(columnId)
                    )}>
                      {columnTaskIds.length}
                    </span>
                  </div>
                </div>

                <Droppable droppableId={columnId}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={cn(
                        "flex-1 rounded-[32px] p-4 lg:p-5 transition-all duration-300 custom-scrollbar overflow-y-auto border",
                        snapshot.isDraggingOver ? "bg-bg-input/50 border-accent/30 ring-4 ring-accent/10" : "bg-bg-input/30 border-border-main/50"
                      )}
                    >
                      {columnTaskIds.map((taskId, index) => (
                        <TaskCard 
                          key={taskId} 
                          task={tasks[taskId]} 
                          index={index} 
                          onDelete={onDeleteTask} 
                          onEdit={onEditTask}
                          onStatusChange={handleStatusChange}
                          isAnimating={animatingTaskId === taskId}
                        />
                      ))}
                      {provided.placeholder}
                      
                      <button
                        onClick={() => onAddTask(columnId)}
                        className="w-full mt-3 py-4 flex items-center justify-center gap-2 text-text-muted hover:text-accent hover:bg-bg-card rounded-2xl transition-all duration-200 group border-2 border-dashed border-border-main/50 hover:border-accent/40 hover:shadow-md"
                      >
                        <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-sm">Add task</span>
                      </button>
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
      
      {/* Status Text at bottom */}
      <div className="py-4 text-center text-[12px] font-bold text-text-muted bg-bg-card/50 backdrop-blur-sm border-t border-border-main/50">
        <span className="hidden lg:inline">Drag and drop tasks between columns, or use the menu button to change status on mobile</span>
        <span className="lg:hidden">Tap the menu button on any task to change its status</span>
      </div>
    </div>
  );
};

export default TaskBoard;
