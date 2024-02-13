export interface TaskGroup {
  id: string;
  title: string;
}

export interface TaskGroupsList {
  lists: TaskGroup[];
}

export interface Tasks {
  id: string;
  title: string;
}

export interface TaskList {
  tasks: Tasks[];
}
