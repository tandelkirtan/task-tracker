import React, { useState } from 'react';
import type { Task, Priority } from '../types';
import { 
  Search, 
  ArrowUpDown, 
  Calendar, 
  Edit2,
  Trash2
} from 'lucide-react';
import { cn } from '../utils';
import ConfirmModal from './ConfirmModal';

interface MyTasksProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const MyTasks: React.FC<MyTasksProps> = ({ tasks, onEdit, onDelete }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Task; direction: 'asc' | 'desc' } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };

  const handleSort = (key: keyof Task) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    
    let valA: any = a[key];
    let valB: any = b[key];

    if (key === 'priority') {
      valA = priorityOrder[a.priority as Priority];
      valB = priorityOrder[b.priority as Priority];
    }

    if (valA < valB) return direction === 'asc' ? -1 : 1;
    if (valA > valB) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredTasks = sortedTasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (taskId: string) => {
    setTaskToDelete(taskId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      onDelete(taskToDelete);
    }
    setShowDeleteConfirm(false);
    setTaskToDelete(null);
  };

  return (
    <>
      <div className="px-4 lg:px-8 py-4 lg:py-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3 lg:mb-8">
        <div className="flex gap-8 border-b border-border-main/50 w-full relative">
          <button className="hidden lg:block pb-4 text-sm font-bold text-accent relative">
            All Tasks
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent rounded-full shadow-[0_-2px_10px_rgba(0,82,204,0.3)]" />
          </button>
          
          <div className="flex gap-3 pb-4 items-center w-full">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input 
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2.5 bg-bg-card border border-border-main rounded-xl text-sm font-bold text-text-primary outline-none w-full focus:ring-4 focus:ring-accent/10 transition-all placeholder:text-text-muted/50 shadow-sm"
              />
            </div>
            <button 
              onClick={() => handleSort('priority')}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 bg-bg-card border border-border-main rounded-xl text-sm font-bold transition-all shadow-sm shrink-0",
                sortConfig?.key === 'priority' ? "text-accent border-accent/20 bg-accent-soft/30" : "text-text-primary hover:bg-bg-input"
              )}
            >
              <ArrowUpDown className="w-4 h-4" />
              <span className="hidden lg:inline">Sort Priority</span>
            </button>
          </div>
        </div>
      </div>

      {/* Priority Legend - Mobile Only */}
      <div className="lg:hidden mb-3 p-2.5 bg-bg-input/30 rounded-xl border border-border-main/50 flex items-center justify-center gap-3">
        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest shrink-0">Priorities:</p>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-brand-red shadow-sm" />
            <span className="text-[10px] font-bold text-text-primary">High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-brand-blue shadow-sm" />
            <span className="text-[10px] font-bold text-text-primary">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-brand-green shadow-sm" />
            <span className="text-[10px] font-bold text-text-primary">Low</span>
          </div>
        </div>
      </div>

      <div className="bg-bg-card rounded-[24px] lg:rounded-[32px] border border-border-main overflow-hidden flex-1 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border-main bg-bg-input">
              <th className="px-4 lg:px-6 py-3 lg:py-5 text-[10px] lg:text-[11px] font-bold text-text-muted uppercase tracking-widest">Task Name</th>
              <th className="hidden sm:table-cell px-4 lg:px-6 py-3 lg:py-5 text-[10px] lg:text-[11px] font-bold text-text-muted uppercase tracking-widest">Priority</th>
              <th className="px-4 lg:px-6 py-3 lg:py-5 text-[10px] lg:text-[11px] font-bold text-text-muted uppercase tracking-widest text-center">Status</th>
              <th className="hidden md:table-cell px-4 lg:px-6 py-3 lg:py-5 text-[10px] lg:text-[11px] font-bold text-text-muted uppercase tracking-widest">Due Date</th>
              <th className="px-4 lg:px-6 py-3 lg:py-5 text-[10px] lg:text-[11px] font-bold text-text-muted uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-main/30">
            {filteredTasks.map((task) => (
              <tr key={task.id} className="hover:bg-bg-input/50 transition-colors group">
                <td className="px-4 lg:px-6 py-3 lg:py-5">
                  <div className="flex items-start gap-3 lg:gap-4">
                    <div className={cn(
                      "w-1 h-6 lg:h-10 rounded-full shrink-0 shadow-sm mt-0.5",
                      task.priority === 'High' ? "bg-brand-red" :
                      task.priority === 'Medium' ? "bg-brand-blue" :
                      "bg-brand-green"
                    )} />
                    <div className="flex-1 min-w-0">
                      <span className={cn(
                        "font-bold text-text-primary text-xs lg:text-sm block group-hover:text-accent transition-colors",
                        task.status === 'DONE' && "line-through opacity-50"
                      )}>
                        {task.title}
                      </span>
                      <div className="md:hidden flex items-center gap-1.5 mt-1 text-text-muted text-[9px] font-bold uppercase tracking-widest">
                        <Calendar className="w-3 h-3" />
                        <span>{task.date}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="hidden sm:table-cell px-4 lg:px-6 py-3 lg:py-5">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full shadow-sm",
                      task.priority === 'High' ? "bg-brand-red" :
                      task.priority === 'Medium' ? "bg-brand-blue" :
                      "bg-brand-green"
                    )} />
                    <span className="text-[10px] lg:text-xs font-bold text-text-primary uppercase tracking-wider">{task.priority}</span>
                  </div>
                </td>
                <td className="px-4 lg:px-6 py-3 lg:py-5 text-center">
                  <span className={cn(
                    "text-[9px] lg:text-[10px] font-bold px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg uppercase tracking-wider inline-block shadow-sm",
                    task.status === 'DONE' ? "bg-brand-green/10 text-brand-green border border-brand-green/20" :
                    task.status === 'IN-PROGRESS' ? "bg-brand-yellow/10 text-brand-yellow border border-brand-yellow/20" :
                    "bg-bg-input text-text-muted border border-border-main/50"
                  )}>
                    {task.status.replace('-', ' ')}
                  </span>
                </td>
                <td className="hidden md:table-cell px-4 lg:px-6 py-3 lg:py-5">
                  <div className="flex items-center gap-2 text-text-muted text-[10px] lg:text-xs font-bold uppercase tracking-widest">
                    <Calendar className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                    <span>{task.date}</span>
                  </div>
                </td>
                <td className="px-4 lg:px-6 py-3 lg:py-5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {task.status !== 'DONE' && (
                      <button 
                        onClick={() => onEdit(task)}
                        className="p-1.5 lg:p-2 text-text-muted hover:text-accent hover:bg-accent/10 rounded-xl transition-all"
                      >
                        <Edit2 className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(task.id)}
                      className="p-1.5 lg:p-2 text-text-muted hover:text-brand-red hover:bg-brand-red/10 rounded-xl transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredTasks.length === 0 && (
          <div className="py-16 lg:py-24 text-center">
            <div className="bg-bg-input/50 w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-border-main/50">
              <Search className="w-6 h-6 lg:w-8 lg:h-8 text-text-muted opacity-30" />
            </div>
            <p className="text-text-muted font-bold text-xs lg:text-sm uppercase tracking-widest opacity-50 italic">No matching tasks found</p>
          </div>
        )}
      </div>
      <div className="mt-3 lg:mt-6 flex items-center justify-center text-text-muted text-[10px] lg:text-[11px] font-bold uppercase tracking-widest px-4">
        <span className="bg-bg-card px-2.5 lg:px-3 py-1.5 rounded-lg border border-border-main/50 shadow-sm">
          Showing {filteredTasks.length} of {tasks.length} tasks
        </span>
      </div>
    </div>

    <ConfirmModal
      isOpen={showDeleteConfirm}
      onClose={() => setShowDeleteConfirm(false)}
      onConfirm={confirmDelete}
      title="Delete Task"
      message="Are you sure you want to delete this task? This action cannot be undone."
      confirmText="Delete"
      cancelText="Cancel"
      variant="danger"
    />
    </>
  );
};

export default MyTasks;
