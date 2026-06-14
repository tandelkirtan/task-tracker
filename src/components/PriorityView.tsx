import React, { useState } from 'react';
import type { Task, Priority } from '../types';
import { 
  AlertCircle, 
  HelpCircle, 
  ArrowDownCircle, 
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { cn } from '../utils';

interface PriorityViewProps {
  tasks: Task[];
  onNavigateToMyTasks: () => void;
}

const PriorityView: React.FC<PriorityViewProps> = ({ tasks, onNavigateToMyTasks }) => {
  const [selectedPriority, setSelectedPriority] = useState<Priority | 'All'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const filteredTasks = tasks.filter(t => 
    selectedPriority === 'All' ? true : t.priority === selectedPriority
  );

  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);

  // Reset page when filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedPriority]);

  const stats = [
    { label: 'High Priority', value: tasks.filter(t => t.priority === 'High').length, icon: AlertCircle, color: 'text-brand-red', bg: 'bg-brand-red/10' },
    { label: 'Medium Priority', value: tasks.filter(t => t.priority === 'Medium').length, icon: HelpCircle, color: 'text-brand-blue', bg: 'bg-brand-blue/10' },
    { label: 'Low Priority', value: tasks.filter(t => t.priority === 'Low').length, icon: ArrowDownCircle, color: 'text-brand-yellow', bg: 'bg-brand-yellow/10' },
    { label: 'Completed', value: tasks.filter(t => t.status === 'DONE').length, icon: CheckCircle2, color: 'text-brand-green', bg: 'bg-brand-green/10' },
  ];

  const chartData = [
    { name: 'High', value: tasks.filter(t => t.priority === 'High').length, color: '#ff5630' },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'Medium').length, color: '#579dff' },
    { name: 'Low', value: tasks.filter(t => t.priority === 'Low').length, color: '#ffab00' },
    { name: 'Completed', value: tasks.filter(t => t.status === 'DONE').length, color: '#36b37e' },
  ];

  const statusChartData = [
    { name: 'TODO', value: tasks.filter(t => t.status === 'TODO').length, color: '#0066ff' },
    { name: 'IN PROGRESS', value: tasks.filter(t => t.status === 'IN-PROGRESS').length, color: '#ffb300' },
    { name: 'DONE', value: tasks.filter(t => t.status === 'DONE').length, color: '#00c853' },
  ];

  return (
    <div className="px-4 lg:px-8 py-4 lg:py-6 space-y-6 lg:space-y-8 overflow-y-auto max-h-full custom-scrollbar">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-text-primary">Status Dashboard</h2>
          <p className="text-text-muted text-xs lg:text-sm mt-1">Real-time overview of your task distribution.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-bg-card p-4 lg:p-6 rounded-[24px] lg:rounded-[32px] border border-border-main shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
            <div>
              <p className="text-[9px] lg:text-[11px] font-bold text-text-muted uppercase tracking-widest mb-1 whitespace-nowrap">{stat.label}</p>
              <h3 className="text-2xl lg:text-3xl font-bold text-text-primary">{stat.value}</h3>
              <p className="text-[9px] lg:text-[10px] font-bold text-text-muted mt-1 uppercase opacity-60">Total Tasks</p>
            </div>
            <div className={cn("p-2 lg:p-4 rounded-[12px] lg:rounded-[20px] transition-transform group-hover:scale-110 shadow-sm", stat.bg, stat.color)}>
              <stat.icon className="w-4 h-4 lg:w-8 lg:h-8" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 pb-8 lg:pb-10">
        <div className="bg-bg-card p-6 lg:p-8 rounded-[32px] lg:rounded-[40px] border border-border-main shadow-sm">
          <h3 className="text-base lg:text-lg font-bold text-text-primary mb-6 lg:mb-8">Tasks Distribution</h3>
          
          {/* Priority Pie Chart */}
          <div className="mb-6 lg:mb-8">
            <p className="text-[10px] lg:text-[11px] font-bold text-text-muted uppercase tracking-widest mb-3 lg:mb-4">By Priority</p>
            <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
              <div className="h-[250px] lg:h-[300px] w-full lg:w-1/2 relative min-w-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={10}
                      dataKey="value"
                      stroke="none"
                      activeShape={false}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" strokeWidth={0} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)', padding: '16px', backgroundColor: '#ffffff', color: '#1a1a1a' }}
                      itemStyle={{ fontWeight: 'bold', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 lg:text-4xl flex flex-col items-center justify-center pointer-events-none">
                  <span className="font-bold text-[40px] lg:text-[40px] text-text-primary">{tasks.length}</span>
                  <span className="text-[20px] lg:text-[20px] font-bold text-text-muted uppercase tracking-widest mt-1">Total</span>
                </div>
              </div>
              <div className="w-full lg:w-1/2 grid grid-cols-1 gap-2 lg:gap-3">
                {chartData.map(item => (
                  <div key={item.name} className="flex items-center justify-between p-2 lg:p-3 rounded-xl bg-bg-input/30 border border-border-main/50 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                      <span className="text-[9px] lg:text-[10px] font-bold text-text-muted uppercase tracking-widest">{item.name}</span>
                    </div>
                    <span className="text-[10px] lg:text-xs font-bold text-text-primary">{Math.round((item.value / tasks.length) * 100) || 0}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Status Bar Chart */}
          <div className="border-t border-border-main/50 pt-6 lg:pt-8">
            <p className="text-[10px] lg:text-[11px] font-bold text-text-muted uppercase tracking-widest mb-3 lg:mb-4">By Status</p>
            <div className="h-[200px] lg:h-[280px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart data={statusChartData} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-main)" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: 'var(--text-muted)', fontSize: 9, fontWeight: 'bold' }}
                    axisLine={{ stroke: 'var(--border-main)' }}
                    tickLine={{ stroke: 'var(--border-main)' }}
                  />
                  <YAxis 
                    tick={{ fill: 'var(--text-muted)', fontSize: 9, fontWeight: 'bold' }}
                    axisLine={{ stroke: 'var(--border-main)' }}
                    tickLine={{ stroke: 'var(--border-main)' }}
                    hide={true}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)', padding: '16px', backgroundColor: '#ffffff', color: '#1a1a1a' }}
                    itemStyle={{ fontWeight: 'bold', fontSize: '12px' }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 8, 8]} isAnimationActive={false} activeBar={false}>
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" strokeWidth={0} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-2 lg:gap-3 mt-3 lg:mt-4">
              {statusChartData.map(item => (
                <div key={item.name} className="flex items-center justify-between p-2 lg:p-3 rounded-xl bg-bg-input/30 border border-border-main/50 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                    <span className="text-[9px] lg:text-[10px] font-bold text-text-muted uppercase tracking-widest">{item.name}</span>
                  </div>
                  <span className="text-[10px] lg:text-xs font-bold text-text-primary">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-bg-card p-6 lg:p-8 rounded-[32px] lg:rounded-[40px] border border-border-main shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            <h3 className="text-base lg:text-lg font-bold text-text-primary">Tasks</h3>
            <div className="relative">
              <select 
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value as any)}
                className="bg-bg-input border border-border-main/50 pl-3 pr-8 py-1.5 rounded-lg text-xs lg:text-sm font-bold text-accent outline-none appearance-none cursor-pointer hover:bg-bg-input/80 transition-all shadow-sm"
              >
                <option value="All">All Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-accent pointer-events-none" />
            </div>
          </div>
          
          <div className="space-y-3 lg:space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
            {paginatedTasks.length > 0 ? (
              paginatedTasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 lg:p-5 rounded-[20px] lg:rounded-[24px] border border-border-main/30 bg-bg-input/20 hover:bg-bg-input/50 transition-all group">
                  <div className="flex-1 min-w-0 pr-3 lg:pr-4">
                    <h4 className="font-bold text-text-primary text-xs lg:text-sm group-hover:text-accent transition-colors truncate">{task.title}</h4>
                    <p className="text-[10px] lg:text-[11px] font-bold text-text-muted mt-1 uppercase tracking-widest opacity-60">Due {task.date}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={cn(
                      "text-[9px] lg:text-[9px] font-bold px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg uppercase tracking-widest inline-block shadow-sm",
                      task.status === 'DONE' ? "bg-brand-green/10 text-brand-green border border-brand-green/20" : 
                      task.status === 'IN-PROGRESS' ? "bg-brand-yellow/10 text-brand-yellow border border-brand-yellow/20" : 
                      "bg-bg-input text-text-muted border border-border-main/50"
                    )}>
                      {task.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-16 lg:py-24 text-text-muted opacity-50">
                <CheckCircle2 className="w-12 h-12 lg:w-16 lg:h-16 mb-4 opacity-20" />
                <p className="font-bold text-[10px] lg:text-xs uppercase tracking-widest">No tasks matching this filter</p>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {filteredTasks.length > itemsPerPage && (
            <div className="flex items-center justify-between pt-3 lg:pt-4 border-t border-border-main/50 mt-3 lg:mt-4">
              <p className="text-[9px] lg:text-[10px] font-bold text-text-muted uppercase tracking-widest">
                Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredTasks.length)} of {filteredTasks.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 lg:p-2 rounded-lg bg-bg-input border border-border-main/50 text-text-muted hover:text-text-primary hover:bg-bg-card disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={cn(
                        "w-8 h-8 rounded-lg text-xs font-bold transition-all",
                        currentPage === page
                          ? "bg-brand-blue text-white shadow-md shadow-brand-blue/20"
                          : "bg-bg-input text-text-muted hover:text-text-primary hover:bg-bg-card border border-border-main/50"
                      )}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-bg-input border border-border-main/50 text-text-muted hover:text-text-primary hover:bg-bg-card disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* View All Tasks Button */}
          <button 
            onClick={onNavigateToMyTasks}
            className="mt-4 w-full py-3 bg-bg-input border border-border-main/50 rounded-xl text-xs lg:text-sm font-bold text-accent hover:bg-bg-card hover:border-accent/30 transition-all"
          >
            View all tasks
          </button>
        </div>
      </div>
    </div>
  );
};

export default PriorityView;
