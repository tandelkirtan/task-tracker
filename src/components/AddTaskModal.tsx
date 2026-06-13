import React, { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon } from 'lucide-react';
import type { Status, Priority, Task } from '../types';
import { format } from 'date-fns';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, priority: Priority, status: Status, description: string, date: string) => void;
  initialStatus: Status;
  editTask?: Task | null;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onAdd, initialStatus, editTask }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [status, setStatus] = useState<Status>(initialStatus);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setPriority(editTask.priority);
      setStatus(editTask.status);
      setDescription(editTask.description || '');
      // Try to parse existing date if it's in a compatible format, otherwise use current
      try {
        const d = new Date(editTask.date);
        if (!isNaN(d.getTime())) {
          setDate(format(d, 'yyyy-MM-dd'));
        }
      } catch (e) {
        setDate(format(new Date(), 'yyyy-MM-dd'));
      }
    } else {
      setTitle('');
      setPriority('Medium');
      setStatus(initialStatus);
      setDescription('');
      setDate(format(new Date(), 'yyyy-MM-dd'));
    }
  }, [editTask, initialStatus, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    // Format date for display
    const displayDate = format(new Date(date), 'MMM d');
    onAdd(title, priority, status, description, displayDate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-bg-card rounded-[40px] w-full max-w-xl shadow-2xl overflow-hidden animate-scale-in border border-border-main/50 max-h-[90vh] flex flex-col">
        <div className="px-6 lg:px-10 py-4 lg:py-6 border-b border-border-main/50 flex items-center justify-between bg-gradient-to-r from-bg-input/50 to-bg-card shrink-0">
          <div>
            <h3 className="text-xl lg:text-2xl font-bold text-text-primary">{editTask ? 'Edit Task' : 'Create New Task'}</h3>
            <p className="text-xs lg:text-sm text-text-muted font-bold uppercase tracking-widest mt-1 opacity-60">Task Details</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 lg:p-3 bg-bg-card hover:bg-bg-input rounded-2xl transition-all shadow-sm border border-border-main/50 text-text-muted hover:text-text-primary hover:scale-110"
          >
            <X className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 lg:p-10 space-y-4 lg:space-y-6 overflow-y-auto flex-1">
          <div className="space-y-2">
            <label className="text-[10px] lg:text-[11px] font-bold text-text-muted uppercase tracking-widest ml-1">Task Title</label>
            <input
              autoFocus
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full px-4 lg:px-6 py-3 lg:py-4 bg-bg-input border-2 border-transparent focus:border-accent/30 focus:bg-bg-card focus:ring-4 focus:ring-accent/10 rounded-[20px] outline-none transition-all font-bold text-text-primary placeholder:text-text-muted/30 shadow-md text-sm lg:text-base"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] lg:text-[11px] font-bold text-text-muted uppercase tracking-widest ml-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add some more details about this task..."
              rows={2}
              className="w-full px-4 lg:px-6 py-3 lg:py-4 bg-bg-input border-2 border-transparent focus:border-accent/30 focus:bg-bg-card focus:ring-4 focus:ring-accent/10 rounded-[20px] outline-none transition-all font-bold text-text-primary placeholder:text-text-muted/30 shadow-md resize-none text-sm lg:text-base"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-8">
            <div className="space-y-2">
              <label className="text-[10px] lg:text-[11px] font-bold text-text-muted uppercase tracking-widest ml-1">Priority</label>
              <div className="relative">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="w-full px-4 lg:px-6 py-3 lg:py-4 bg-bg-input border-2 border-transparent focus:border-accent/30 focus:bg-bg-card focus:ring-4 focus:ring-accent/10 rounded-[20px] outline-none transition-all font-bold text-text-primary appearance-none cursor-pointer shadow-md text-sm lg:text-base"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                <div className="absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 pointer-events-none w-2.5 h-2.5 rounded-full bg-accent shadow-sm" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] lg:text-[11px] font-bold text-text-muted uppercase tracking-widest ml-1">Due Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 lg:px-6 py-3 lg:py-4 bg-bg-input border-2 border-transparent focus:border-accent/30 focus:bg-bg-card focus:ring-4 focus:ring-accent/10 rounded-[20px] outline-none transition-all font-bold text-text-primary appearance-none cursor-pointer shadow-md text-sm lg:text-base"
                />
                <CalendarIcon className="absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 pointer-events-none w-4 h-4 text-text-muted" />
              </div>
            </div>
          </div>

          <div className="pt-2 lg:pt-4 flex gap-3 lg:gap-4 shrink-0">
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex-1 py-3 lg:py-5 bg-gradient-to-r from-brand-blue to-accent text-white font-bold rounded-[20px] shadow-xl shadow-brand-blue/20 hover:shadow-2xl hover:shadow-brand-blue/30 disabled:opacity-50 disabled:shadow-none transition-all active:scale-[0.98] text-sm lg:text-base"
            >
              {editTask ? 'Save Changes' : 'Create Task'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 lg:px-8 py-3 lg:py-5 bg-bg-card border border-border-main text-text-muted font-bold rounded-[20px] hover:bg-bg-input transition-all shadow-md hover:shadow-lg text-sm lg:text-base"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
