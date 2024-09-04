import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { DialogService } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { SplitterModule } from 'primeng/splitter';
import { tap } from 'rxjs';
import { Task, TaskStatus } from '../../../models/task-model';
import { TasksService } from '../../../services/tasks.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-create-edit-task',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, DropdownModule, CalendarModule, SplitterModule, ButtonModule, AsyncPipe],
  templateUrl: './create-edit-task.component.html',
  styleUrl: './create-edit-task.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEditTaskComponent {

  readonly taskStatuses: TaskStatus[] = [
    'Done',
    'In Progress',
    'To Do',
  ]

  private tasksService = inject(TasksService);
  private dialogService = inject(DialogService);
  private selectedTask: Task | undefined = undefined;
  selectedTask$ = this.tasksService.selectedTask$.pipe(tap(task => {
    this.selectedTask = task;
    if (task) {
      this.form.controls.title.setValue(task?.title);
      this.form.controls.description.setValue(task?.description);
      this.form.controls.dueDate.setValue(task?.dueDate);
      this.form.controls.status.setValue(task?.status);
    }
  }));

  form = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [Validators.required, Validators.minLength(5)]),
    dueDate: new FormControl<Date | undefined>(undefined, Validators.required),
    status: new FormControl<TaskStatus | ''>('', Validators.required),
  });

  clickDone() {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach(fc => fc.markAsDirty());
      return;
    } else {
      const formTask = { id: this.selectedTask?.id, ...this.form.value } as Task;
      this.tasksService.addEditTask(formTask);
      this.clickClose();    }
  }

  clickClose() {
    this.dialogService.dialogComponentRefMap.forEach(dialogR => dialogR.destroy());
  }
}
