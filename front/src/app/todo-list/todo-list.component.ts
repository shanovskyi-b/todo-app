import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../shared/api-service/api.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { TaskListManagerService } from '../shared/task-list-manager/task-list-manager.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListComponent implements OnInit, OnDestroy {
  @ViewChild('newTaskListFormField') newTaskListFormField: ElementRef | undefined;

  radioBtnGroup: FormGroup = new FormGroup ({
    activeTaskList: new FormControl()
  })

  allTaskLists = this.taskListManager.allTaskLists$;

  selectedTaskListIndex = this.taskListManager.selectedTaskListIndex$;

  isNewTaskListFormFieldVisible: boolean = false;

  isResultLoading: boolean = false;

  activeListId: string = '';

  taskListInputValue: string = '';

  private destroy$ = new Subject<void>();

  constructor(private taskListManager: TaskListManagerService, private apiService: ApiService, private changeDetectorRef: ChangeDetectorRef, private router: Router) {}

  ngOnInit(): void {
    this.taskListManager.loadLists();
    
    this.taskListManager.listId$
      .pipe(takeUntil(this.destroy$))
      .subscribe(listId => {
        this.activeListId = listId;
        this.radioBtnGroup.controls['activeTaskList'].setValue(listId);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  stopPropagation(event: Event): boolean {
    event.stopPropagation();
    return false;
  }

  onRename(id: string, title: string) {
    this.taskListManager.renameTaskList(id, title);
  }

  onDelete(id: string) {
    this.taskListManager.deleteTaskListById(id);
  }

  onBlur(): void {
    this.taskListManager.changeActiveIndex(undefined);
    this.isNewTaskListFormFieldVisible = false;
    this.changeDetectorRef.markForCheck();
  }

  showRenameTaskListInput(taskListIndex: number, taskListTitle: string): void {
    this.taskListManager.changeActiveIndex(taskListIndex);
    this.taskListInputValue = taskListTitle;
  }

  showNewTaskListFormField(): void {
    this.isNewTaskListFormFieldVisible = true;
  }

  createNewTaskList(name: string): void {
    if (!name) {
      return;
    }

    this.isResultLoading = true;

    this.apiService.createTaskList(name)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const list = data.list.id;
        this.changeDetectorRef.markForCheck();
        this.taskListManager.loadLists();
        this.router.navigate([], {queryParams: {list}});
        this.isResultLoading = false;
      })

    this.isNewTaskListFormFieldVisible = false;
  }
}
