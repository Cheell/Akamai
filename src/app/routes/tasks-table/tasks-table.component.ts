import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Table, TableModule } from 'primeng/table';
import { Task } from '../../models/task-model';
import { TasksService } from '../../services/tasks.service';
import { CreateEditTaskComponent } from './create-edit-task/create-edit-task.component';
import { ConfirmationService } from 'primeng/api';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-tasks-table',
  standalone: true,
  imports: [TableModule, CommonModule, ButtonModule, ConfirmDialogModule, ReactiveFormsModule, IconFieldModule, InputIconModule, InputTextModule],
  templateUrl: './tasks-table.component.html',
  styleUrl: './tasks-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService, ConfirmationService]
})
export class TasksTableComponent {
  private tasksService = inject(TasksService);
  private confirmationService = inject(ConfirmationService);
  tasks$ = this.tasksService.tasks$;
  filterFC = new FormControl();

  private ref: DynamicDialogRef | undefined;

  private dialogService = inject(DialogService)

  createEditTask(task: Task | undefined) {
    this.tasksService.selectTask(task);
    this.ref = this.dialogService.open(CreateEditTaskComponent, {
      width: '35rem', modal: true, header: 'Create New Task'
    });
  }

  deleteTask(event: Event, task: Task) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Are you sure that you want to delete task: ${task.title} ?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        this.tasksService.deleteTask(task);
      },
      reject: () => { }
    });
  }

  filter(event: Event, table: Table) {
    table.filterGlobal((event.target as any).value, 'contains');
  }

}
