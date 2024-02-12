export interface TaskGroup {
  id: string;
  title: string;
}

export interface TaskGroupsList {
  lists: TaskGroup[];
}
export interface TaskList {
  tasks: TaskGroup[];
}
