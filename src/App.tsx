import React, { useState, useEffect } from 'react';
import type { DropResult } from '@hello-pangea/dnd';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TaskBoard from './components/TaskBoard';
import AddTaskModal from './components/AddTaskModal';
import MyTasks from './components/MyTasks';
import CalendarView from './components/CalendarView';
import PriorityView from './components/PriorityView';
import SettingsView from './components/SettingsView';
import Login from './components/Login';
import { AuthProvider, useAuth } from './context/AuthContext';
import { supabase } from './supabaseClient';
import type { Task, Column, Status, Priority, View } from './types';

const INITIAL_COLUMNS: { [key in Status]: Column } = {
  'TODO': {
    id: 'TODO',
    title: 'TO-DO',
    taskIds: [],
  },
  'IN-PROGRESS': {
    id: 'IN-PROGRESS',
    title: 'IN-PROGRESS',
    taskIds: [],
  },
  'DONE': {
    id: 'DONE',
    title: 'DONE',
    taskIds: [],
  },
};

const App: React.FC = () => {
  const { user, loading, error, logout } = useAuth();
  const [tasks, setTasks] = useState<{ [key: string]: Task }>({});
  const [columns, setColumns] = useState<{ [key in Status]: Column }>(INITIAL_COLUMNS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeColumn, setActiveColumn] = useState<Status>('TODO');
  const [activeView, setActiveView] = useState<View>('Board');
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Fetch tasks from Supabase when user changes
  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching tasks:', error);
      return;
    }

    // Convert array to object format
    const tasksObj = data.reduce((acc, task) => {
      acc[task.id] = {
        ...task,
        assignee: { name: user.user_metadata?.full_name || user.email, avatar: user.user_metadata?.avatar_url },
      };
      return acc;
    }, {} as { [key: string]: Task });

    setTasks(tasksObj);

    // Update columns based on task statuses
    const newColumns = { ...INITIAL_COLUMNS };
    data.forEach(task => {
      if (newColumns[task.status]) {
        newColumns[task.status].taskIds.push(task.id);
      }
    });
    setColumns(newColumns);
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = columns[source.droppableId as Status];
    const finish = columns[destination.droppableId as Status];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      setColumns({
        ...columns,
        [newColumn.id]: newColumn,
      });
      return;
    }

    // Moving from one list to another
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    setColumns({
      ...columns,
      [newStart.id]: newStart,
      [newFinish.id]: newFinish,
    });

    // Update task status in Supabase
    await supabase
      .from('tasks')
      .update({ status: destination.droppableId as Status })
      .eq('id', draggableId);

    setTasks({
      ...tasks,
      [draggableId]: {
        ...tasks[draggableId],
        status: destination.droppableId as Status,
      },
    });
  };

  const handleAddTask = (status: Status) => {
    setEditingTask(null);
    setActiveColumn(status);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setActiveColumn(task.status);
    setIsModalOpen(true);
  };

  const onAdd = async (title: string, priority: Priority, status: Status, description: string, date: string) => {
    if (editingTask) {
      // Update existing task in Supabase
      const { error } = await supabase
        .from('tasks')
        .update({
          title,
          priority,
          status,
          description,
          date,
        })
        .eq('id', editingTask.id);

      if (error) {
        console.error('Error updating task:', error);
        return;
      }

      const updatedTask = {
        ...editingTask,
        title,
        priority,
        status,
        description,
        date
      };

      // If status changed, we need to move it in columns too
      if (editingTask.status !== status) {
        const oldCol = columns[editingTask.status];
        const newCol = columns[status];
        
        setColumns({
          ...columns,
          [oldCol.id]: {
            ...oldCol,
            taskIds: oldCol.taskIds.filter(id => id !== editingTask.id)
          },
          [newCol.id]: {
            ...newCol,
            taskIds: [...newCol.taskIds, editingTask.id]
          }
        });
      }

      setTasks({
        ...tasks,
        [editingTask.id]: updatedTask
      });
    } else {
      // Insert new task into Supabase
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title,
          priority,
          status,
          description,
          date,
          category: 'General',
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding task:', error);
        return;
      }

      const newTask: Task = {
        ...data,
        assignee: { name: user.user_metadata?.full_name || user.email, avatar: user.user_metadata?.avatar_url },
      };

      setTasks({
        ...tasks,
        [data.id]: newTask,
      });

      const column = columns[status];
      setColumns({
        ...columns,
        [status]: {
          ...column,
          taskIds: [...column.taskIds, data.id],
        },
      });
    }
  };

  const onDeleteTask = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const taskToDelete = tasks[taskId];
      if (!taskToDelete) return;

      // Delete from Supabase
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) {
        console.error('Error deleting task:', error);
        return;
      }

      const newTasks = { ...tasks };
      delete newTasks[taskId];
      setTasks(newTasks);

      const column = columns[taskToDelete.status];
      const newTaskIds = column.taskIds.filter(id => id !== taskId);
      setColumns({
        ...columns,
        [column.id]: {
          ...column,
          taskIds: newTaskIds,
        },
      });
    }
  };

  const renderView = () => {
    const taskList = Object.values(tasks);
    const userProfile = {
      name: user?.user_metadata?.full_name || user?.email || 'User',
      email: user?.email || '',
      avatar: user?.user_metadata?.avatar_url,
      bio: 'Task Manager User'
    };

    switch (activeView) {
      case 'Board':
        return (
          <TaskBoard
            tasks={tasks}
            columns={columns}
            onDragEnd={onDragEnd}
            onAddTask={handleAddTask}
            onDeleteTask={onDeleteTask}
            onEditTask={handleEditTask}
          />
        );
      case 'My Tasks':
        return <MyTasks tasks={taskList} onEdit={handleEditTask} onDelete={onDeleteTask} />;
      case 'Calendar':
        return <CalendarView tasks={taskList} onAddTask={handleAddTask} />;
      case 'Priority':
        return <PriorityView tasks={taskList} onNavigateToMyTasks={() => setActiveView('My Tasks')} />;
      case 'Settings':
        return <SettingsView user={userProfile} onUpdateUser={() => {}} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <div className="text-text-muted font-bold">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-bg-card rounded-2xl border border-border-main p-8 text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-4">Connection Error</h1>
          <p className="text-text-muted mb-6">{error}</p>
          <p className="text-sm text-text-muted mb-4">Please check your Supabase credentials in the .env file and ensure your Supabase project is properly configured.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-brand-blue to-accent text-white px-6 py-3 rounded-2xl font-bold hover:opacity-90 transition-opacity"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const userProfile = {
    name: user.user_metadata?.full_name || user.email || 'User',
    email: user.email || '',
    avatar: user.user_metadata?.avatar_url,
    bio: 'Task Manager User'
  };

  return (
    <div className="flex min-h-screen bg-inherit transition-colors duration-300">
      <Sidebar activeView={activeView} onViewChange={setActiveView} user={userProfile} />
      
      <main className="flex-1 flex flex-col min-w-0">
        <Header user={userProfile} onLogout={logout} />
        
        <div className="flex-1 overflow-hidden">
          {renderView()}
        </div>
      </main>

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={onAdd}
        initialStatus={activeColumn}
        editTask={editingTask}
      />
    </div>
  );
};

const AppWrapper: React.FC = () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
};

export default AppWrapper;
