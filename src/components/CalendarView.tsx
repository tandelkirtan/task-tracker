import React, { useState } from 'react';
import type { Task, Status } from '../types';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Info,
  Calendar as CalendarIcon
} from 'lucide-react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  isBefore,
  startOfDay
} from 'date-fns';
import { cn } from '../utils';

interface CalendarViewProps {
  tasks: Task[];
  onAddTask: (status: Status) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onAddTask }) => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 1)); // June 2026
  const [selectedDayTasks, setSelectedDayTasks] = useState<{ day: Date; tasks: Task[] } | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  
  const calendarDays = eachDayOfInterval({
    start: startOfWeek(monthStart),
    end: endOfWeek(monthEnd),
  });

  const next = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const prev = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const getTasksForDay = (day: Date) => {
    return tasks.filter(task => {
      // Very simple parsing for demo
      const taskDay = parseInt(task.date.split(' ')[1]);
      const taskMonth = task.date.split(' ')[0];
      return taskDay === day.getDate() && taskMonth === format(day, 'MMM');
    });
  };

  const handleDayClick = (day: Date) => {
    setSelectedDayTasks({ day, tasks: getTasksForDay(day) });
  };

  const isPassed = (day: Date) => isBefore(startOfDay(day), startOfDay(new Date()));

  return (
    <div className="px-4 lg:px-8 py-4 lg:py-6 h-full flex flex-col overflow-hidden relative">
      {/* Instruction Row - Mobile Only */}
      <div className="lg:hidden mb-3 flex items-center justify-center text-text-muted text-[10px] font-bold uppercase tracking-widest bg-bg-input rounded-lg px-3 py-2 border border-border-main/50">
        <Info className="w-3 h-3 mr-2" />
        <span>Click on date to view or add task</span>
      </div>

      <div className="flex items-center justify-between mb-4 lg:mb-8">
        <button 
          onClick={() => setCurrentDate(new Date())}
          className="hidden lg:block px-3 lg:px-4 py-2 bg-bg-card border border-border-main rounded-xl text-xs lg:text-sm font-bold text-text-primary hover:bg-bg-input transition-all shadow-sm"
        >
          Today
        </button>
        <div className="flex items-center gap-2 mx-auto">
          <button onClick={prev} className="p-1.5 lg:p-2 bg-bg-card border border-border-main hover:bg-bg-input rounded-xl transition-colors text-text-muted shadow-sm">
            <ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5" />
          </button>
          <h2 className="text-base lg:text-xl font-bold text-text-primary">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <button onClick={next} className="p-1.5 lg:p-2 bg-bg-card border border-border-main hover:bg-bg-input rounded-xl transition-colors text-text-muted shadow-sm">
            <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5" />
          </button>
        </div>
        <div className="hidden lg:flex items-center gap-2 text-text-muted text-[10px] lg:text-[12px] font-bold uppercase tracking-widest bg-bg-input rounded-lg px-2.5 lg:px-3 py-1.5 border border-border-main/50">
          <Info className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
          <span>Click on date to view or add task</span>
        </div>
      </div>

      <div className="flex-1 bg-bg-card rounded-[24px] lg:rounded-[40px] border border-border-main overflow-hidden flex flex-col shadow-sm">
        <div className="grid grid-cols-7 border-b border-border-main/50 bg-bg-input/30">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-2 lg:py-4 text-center text-[9px] lg:text-[11px] font-bold text-text-muted uppercase tracking-widest">
              {day}
            </div>
          ))}
        </div>

        <div className="flex-1 grid grid-cols-7 overflow-y-auto custom-scrollbar">
          {calendarDays.map((day, i) => {
            const dayTasks = getTasksForDay(day);
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isToday = isSameDay(day, new Date());
            const hasTasks = dayTasks.length > 0;

            return (
              <div 
                key={i} 
                onClick={() => handleDayClick(day)}
                className={cn(
                  "border-r border-b border-border-main/30 p-1.5 lg:p-4 transition-all hover:bg-bg-input/80 cursor-pointer group relative min-h-[60px] lg:min-h-[140px]",
                  !isCurrentMonth ? "bg-bg-input/20 opacity-40" : "",
                  hasTasks && isCurrentMonth ? "bg-accent/15" : ""
                )}
              >
                <div className="flex justify-between items-center mb-1 lg:mb-3">
                  <span className={cn(
                    "text-[10px] lg:text-sm font-bold w-5 h-5 lg:w-8 lg:h-8 flex items-center justify-center rounded-full transition-all group-hover:scale-110",
                    isToday ? "bg-accent text-white shadow-lg shadow-accent/20" : isCurrentMonth ? "text-text-primary" : "text-text-muted/40"
                  )}>
                    {format(day, 'd')}
                  </span>
                </div>
                {/* Mobile: Show dot, Desktop: Show task titles */}
                <div className="lg:hidden flex items-center justify-center">
                  {hasTasks && (
                    <div className="w-2 h-2 rounded-full bg-accent shadow-sm"></div>
                  )}
                </div>
                <div className="hidden lg:block space-y-1 lg:space-y-1.5">
                  {dayTasks.slice(0, 2).map(task => (
                    <div 
                      key={task.id} 
                      className={cn(
                        "text-[9px] lg:text-[10px] p-1.5 lg:p-2 rounded-xl truncate font-bold border shadow-sm",
                        task.priority === 'High' ? "bg-brand-red/5 text-brand-red border-brand-red/10" :
                        task.priority === 'Medium' ? "bg-brand-blue/5 text-brand-blue border-brand-blue/10" :
                        "bg-brand-green/5 text-brand-green border-brand-green/10"
                      )}
                    >
                      {task.title}
                    </div>
                  ))}
                  {dayTasks.length > 2 && (
                    <div className="text-[8px] lg:text-[9px] font-bold text-text-muted text-center pt-1 uppercase tracking-widest">
                      + {dayTasks.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Date Modal */}
      {selectedDayTasks && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-bg-card rounded-[24px] lg:rounded-[40px] w-full max-w-lg shadow-2xl overflow-hidden border border-border-main/50">
            <div className="p-4 lg:p-8 border-b border-border-main/50 flex items-center justify-between bg-bg-input/30">
              <div>
                <h3 className="text-lg lg:text-2xl font-bold text-text-primary">{format(selectedDayTasks.day, 'MMMM d, yyyy')}</h3>
                <p className="text-xs lg:text-sm text-text-muted font-bold uppercase tracking-widest mt-1 opacity-70">Daily Schedule</p>
              </div>
              <button 
                onClick={() => setSelectedDayTasks(null)}
                className="p-2 lg:p-3 bg-bg-card hover:bg-bg-input rounded-xl lg:rounded-2xl transition-all shadow-sm border border-border-main/50 text-text-muted hover:text-text-primary"
              >
                <Plus className="w-5 h-5 lg:w-6 lg:h-6 rotate-45" />
              </button>
            </div>
            
            <div className="p-4 lg:p-8 max-h-[300px] lg:max-h-[400px] overflow-y-auto custom-scrollbar space-y-3 lg:space-y-4">
              {selectedDayTasks.tasks.length > 0 ? (
                selectedDayTasks.tasks.map(task => (
                  <div key={task.id} className="p-3 lg:p-5 rounded-[16px] lg:rounded-[24px] border border-border-main/50 bg-bg-input/30 flex items-center justify-between group hover:border-accent/30 hover:bg-bg-input transition-all">
                    <div className="flex items-center gap-3 lg:gap-4">
                      <div className={cn(
                        "w-1 h-6 lg:h-8 rounded-full shadow-sm",
                        task.priority === 'High' ? "bg-brand-red" :
                        task.priority === 'Medium' ? "bg-brand-blue" : "bg-brand-green"
                      )} />
                      <span className="font-bold text-text-primary text-xs lg:text-sm group-hover:text-accent transition-colors">{task.title}</span>
                    </div>
                    <span className={cn(
                      "text-[9px] lg:text-[10px] font-bold px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg uppercase tracking-wider shadow-sm",
                      task.status === 'DONE' ? "bg-brand-green/10 text-brand-green border border-brand-green/20" : 
                      "bg-accent-soft/30 text-accent border border-accent/20"
                    )}>
                      {task.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-8 lg:py-16 text-center">
                  <div className="w-10 h-10 lg:w-16 lg:h-16 bg-bg-input rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4 border border-border-main/50 opacity-30">
                    <CalendarIcon className="w-5 h-5 lg:w-8 lg:h-8 text-text-muted" />
                  </div>
                  <p className="text-text-muted font-bold text-[10px] lg:text-sm uppercase tracking-widest opacity-50">No tasks for today</p>
                </div>
              )}
            </div>

            <div className="p-4 lg:p-8 bg-bg-input/30 border-t border-border-main/50">
              {!isPassed(selectedDayTasks.day) ? (
                <button 
                  onClick={() => {
                    onAddTask('TODO');
                    setSelectedDayTasks(null);
                  }}
                  className="w-full py-3 lg:py-4 bg-accent text-white font-bold rounded-[16px] lg:rounded-[20px] shadow-xl shadow-accent/20 hover:brightness-110 transition-all flex items-center justify-center gap-2 active:scale-[0.98] text-sm lg:text-base"
                >
                  <Plus className="w-4 h-4 lg:w-5 lg:h-5" /> Add New Task
                </button>
              ) : (
                <div className="text-center text-text-muted text-[10px] lg:text-[11px] font-bold uppercase tracking-widest opacity-50 flex items-center justify-center gap-2 bg-bg-input p-3 lg:p-4 rounded-xl lg:rounded-2xl border border-border-main/50">
                  <Info className="w-3 h-3 lg:w-4 lg:h-4" /> Past date - View only mode
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
