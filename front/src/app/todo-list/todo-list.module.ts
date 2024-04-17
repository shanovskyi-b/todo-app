import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoListComponent } from './todo-list.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { TodoListRoutingModule } from './todo-list-routing.module';
import { ActiveTaskListComponent } from './components/active-task-list/active-task-list.component';
import { FormFieldLayoutComponent } from './components/form-field-layout/form-field-layout.component';


@NgModule({
  declarations: [
    TodoListComponent,
    ActiveTaskListComponent,
    FormFieldLayoutComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    TodoListRoutingModule,
  ],
})
export class TodoListModule { }
