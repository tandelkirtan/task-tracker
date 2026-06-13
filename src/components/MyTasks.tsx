import React, { useState } from 'react';
import type { Task, Priority } from '../types';
import { 
  Search, 
  ArrowUpDown, 
  Calendar, 
  Tag, 
  MoreHorizontal,
  Edit2,
  Trash2
} from 'lucide-react';
import { cn } from '../utils';

interface MyTasksProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const MyTasks: React.FC<MyTasksProps> = ({ tasks, onEdit, onDelete }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Task; direction: 'asc' | 'desc' } | null>(null);

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

  return (
    <div className="px-8 py-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div className="flex gap-8 border-b border-border-main/50 w-full relative">
          <button className="pb-4 text-sm font-bold text-accent relative">
            All Tasks
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent rounded-full shadow-[0_-2px_10px_rgba(0,82,204,0.3)]" />
          </button>
          
          <div className="ml-auto flex gap-3 pb-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input 
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2.5 bg-bg-card border border-border-main rounded-xl text-sm font-bold text-text-primary outline-none w-64 focus:ring-4 focus:ring-accent/10 transition-all placeholder:text-text-muted/50 shadow-sm"
              />
            </div>
            <button 
              onClick={() => handleSort('priority')}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 bg-bg-card border border-border-main rounded-xl text-sm font-bold transition-all shadow-sm",
                sortConfig?.key === 'priority' ? "text-accent border-accent/20 bg-accent-soft/30" : "text-text-primary hover:bg-bg-input"
              )}
            >
              <ArrowUpDown className="w-4 h-4" /> Sort Priority
            </button>
          </div>
        </div>
      </div>

      <div className="bg-bg-card rounded-[32px] border border-border-main overflow-hidden flex-1 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border-main bg-bg-input">
              <th className="px-6 py-5 text-[11px] font-bold text-text-muted uppercase tracking-widest">Task Name</th>
              <th className="px-6 py-5 text-[11px] font-bold text-text-muted uppercase tracking-widest">Priority</th>
              <th className="px-6 py-5 text-[11px] font-bold text-text-muted uppercase tracking-widest">Status</th>
              <th className="px-6 py-5 text-[11px] font-bold text-text-muted uppercase tracking-widest">Due Date</th>
              <th className="px-6 py-5 text-[11px] font-bold text-text-muted uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-main/30">
            {filteredTasks.map((task) => (
              <tr key={task.id} className="hover:bg-bg-input/50 transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-1.5 h-10 rounded-full shrink-0 shadow-sm",
                      task.priority === 'High' ? "bg-brand-red" :
                      task.priority === 'Medium' ? "bg-brand-blue" :
                      "bg-brand-green"
                    )} />
                    <span className={cn(
                      "font-bold text-text-primary text-sm truncate group-hover:text-accent transition-colors",
                      task.status === 'DONE' && "line-through opacity-50"
                    )}>
                      {task.title}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-2.5 h-2.5 rounded-full shadow-sm",
                      task.priority === 'High' ? "bg-brand-red" :
                      task.priority === 'Medium' ? "bg-brand-blue" :
                      "bg-brand-green"
                    )} />
                    <span className="text-xs font-bold text-text-primary uppercase tracking-wider">{task.priority}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={cn(
                    "text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider inline-block shadow-sm",
                    task.status === 'DONE' ? "bg-brand-green/10 text-brand-green border border-brand-green/20" :
                    task.status === 'IN-PROGRESS' ? "bg-brand-yellow/10 text-brand-yellow border border-brand-yellow/20" :
                    "bg-bg-input text-text-muted border border-border-main/50"
                  )}>
                    {task.status.replace('-', ' ')}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 text-text-muted text-xs font-bold uppercase tracking-widest">
                    <Calendar className="w-4 h-4" />
                    <span>{task.date}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {task.status !== 'DONE' && (
                      <button 
                        onClick={() => onEdit(task)}
                        className="p-2 text-text-muted hover:text-accent hover:bg-accent/10 rounded-xl transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    <button 
                      onClick={() => onDelete(task.id)}
                      className="p-2 text-text-muted hover:text-brand-red hover:bg-brand-red/10 rounded-xl transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredTasks.length === 0 && (
          <div className="py-24 text-center">
            <div className="bg-bg-input/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-border-main/50">
              <Search className="w-8 h-8 text-text-muted opacity-30" />
            </div>
            <p className="text-text-muted font-bold text-sm uppercase tracking-widest opacity-50 italic">No matching tasks found</p>
          </div>
        )}
      </div>
      <div className="mt-6 flex items-center justify-between text-text-muted text-[11px] font-bold uppercase tracking-widest px-4">
        <span className="bg-bg-card px-3 py-1.5 rounded-lg border border-border-main/50 shadow-sm">
          Showing {filteredTasks.length} of {tasks.length} tasks
        </span>
      </div>
    </div>
  );
};

export default MyTasks;
