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
  const columnOrder: Status[] = ['TODO', 'IN-PROGRESS', 'DONE'];

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

  return (
    <div className="px-8 py-6 flex flex-col h-full overflow-hidden">
      {/* Search and Add Task Row */}
      <div className="mb-8 flex items-center justify-between gap-4">
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
          className="bg-gradient-to-r from-brand-blue to-accent text-white px-8 py-3 rounded-2xl font-bold text-sm hover:shadow-xl hover:shadow-brand-blue/20 transition-all active:scale-[0.98] whitespace-nowrap"
        >
          Add Task
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-8 flex-1 overflow-x-auto pb-6 custom-scrollbar">
          {columnOrder.map((columnId) => {
            const column = columns[columnId];
            const columnTaskIds = filteredTaskIds(column.taskIds);

            return (
              <div key={columnId} className="flex flex-col w-[380px] min-w-[380px]">
                <div className="flex items-center justify-between mb-6 px-2">
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
                        "flex-1 rounded-[32px] p-5 transition-all duration-300 custom-scrollbar overflow-y-auto border",
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
                          onStatusChange={onStatusChange}
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
