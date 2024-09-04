import { inject, Injectable } from "@angular/core";
import { tempData } from "../../../data";
import { Task } from "../models/task-model";
import { TasksService } from "./tasks.service";
import { filter } from "rxjs";

@Injectable({providedIn: 'root'})

export class SessionService {
  private readonly storageKey = "TASKS_STORAGE_KEY";
  private readonly tasksService = inject(TasksService);

  constructor() {
    this.tasksService.tasks$.pipe(filter(t => t && t.length > 0)).subscribe(tasks => this.saveTasks(tasks));
  }

  load() {
    let tasks = sessionStorage.getItem(this.storageKey) || tempData;
    this.tasksService.loadTasks(this.processStoredData(tasks));
  }

  private processStoredData(jsonString: string): Task[] {
    try {
      const data: Task[] = JSON.parse(jsonString);
      return  data.map(task => ({...task, dueDate: new Date(task.dueDate)}));
    } catch (e) {
      throw 'processStoredData FAILED incorrect JSON'
    }
  }

  private saveTasks = (tasks: Task[]) => sessionStorage.setItem(this.storageKey, JSON.stringify(tasks));
}
