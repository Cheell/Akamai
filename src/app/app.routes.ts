import { Routes } from '@angular/router';
import { TasksTableComponent } from './routes/tasks-table/tasks-table.component';

export const routes: Routes = [
  {path: '**', component: TasksTableComponent}
];
