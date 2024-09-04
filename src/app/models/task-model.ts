export type TaskStatus = 'To Do' | 'In Progress' | 'Done'; 

export type Task = {
  id: number | undefined,
  title: string,
  description: string,
  status: TaskStatus,
  dueDate: Date,
}

