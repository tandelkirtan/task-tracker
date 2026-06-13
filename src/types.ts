export type Priority = 'Low' | 'Medium' | 'High';
export type Status = 'TODO' | 'IN-PROGRESS' | 'DONE';
export type View = 'Board' | 'My Tasks' | 'Calendar' | 'Priority' | 'Settings';
export type Theme = 'light' | 'dark' | 'dim';

export type Task = {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  date: string;
  category: string;
  assignee: {
    name: string;
    avatar?: string;
  };
};

export type UserProfile = {
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
};

export type Column = {
  id: Status;
  title: string;
  taskIds: string[];
};
