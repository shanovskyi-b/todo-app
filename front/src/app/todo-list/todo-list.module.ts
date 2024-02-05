import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoListComponent } from './todo-list.component';
import { SharedModule } from '../shared/shared.module';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    component: TodoListComponent,
  }
];


@NgModule({
  declarations: [
    TodoListComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class TodoListModule { }
