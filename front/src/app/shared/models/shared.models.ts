export interface TaskGroup {
  id: string;
  title: string;
}

export interface TaskGroupsList {
  lists: TaskGroup[];
}

export interface Task {
  id: string;
  title: string;
}

export interface TaskList {
  tasks: Task[];
}

export interface NewTaskList {
  list: TaskGroup;
}

export interface TasksGroup {
  allTasks: Task[];
  task: Task;
}
