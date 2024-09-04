import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Task } from "../models/task-model";

@Injectable({ providedIn: 'root' })

export class TasksService {
  private _tasks$ = new BehaviorSubject<Task[]>([]);
  tasks$ = this._tasks$.asObservable();

  private _selectedTask$ = new BehaviorSubject<Task | undefined>(undefined);
  selectTask = (task: Task | undefined) => this._selectedTask$.next(task);
  selectedTask$ = this._selectedTask$.asObservable();

  loadTasks(tasks: Task[]) {
    this._tasks$.next(tasks);
  }

  addEditTask(inputTask: Task) {
    const tasks = this._tasks$.value;

    if (!inputTask.id) {
      inputTask.id = new Date().getTime();
      tasks.push(inputTask);
    } else {
      const index = tasks.findIndex(t => t.id === inputTask.id);
      if (index === -1) { throw 'updateTask failed: Incorrect Indexs Value' }
      tasks[index] = inputTask;
    }
    this._tasks$.next([...tasks]);
  }

  deleteTask(task: Task) {
    const tasks = this._tasks$.value;
    const index = tasks.findIndex(t => t.id === task.id);
    if (index > -1) {
      tasks.splice(index, 1);
      this._tasks$.next(tasks);
    }
  }


}
