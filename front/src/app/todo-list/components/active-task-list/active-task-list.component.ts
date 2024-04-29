import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TaskGroup, TaskGroupsList, TaskList } from '../../../shared/models/shared.models';
import { Observable, Subject, filter, switchMap, takeUntil } from 'rxjs';
import { ApiService } from '../../../shared/api-service/api.service';
import { TaskListManagerService } from '../../../shared/task-list-manager/task-list-manager.service';

@Component({
  selector: 'app-active-task-list',
  templateUrl: './active-task-list.component.html',
  styleUrl: './active-task-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActiveTaskListComponent implements OnDestroy, OnInit {
  isRenameTaskListVisible: boolean = false
 
  taskList: TaskList | undefined;

  activeTaskList: TaskGroup[] | undefined;

  isNewTaskInputVisible: boolean = false;

  activeListId: string | undefined;

  private destroy$ = new Subject<void>();

  constructor(private apiService: ApiService, private taskListManager: TaskListManagerService, private changeDetectorRef: ChangeDetectorRef) {
  } 

  ngOnInit(): void {
    this.taskListManager.listId$.pipe(
      takeUntil(this.destroy$)
    )
    .subscribe(listId => {
      this.activeListId = listId;
    })

    this.taskListManager.allTaskLists
      .pipe(
        filter<TaskGroupsList | undefined, TaskGroupsList>((data): data is TaskGroupsList => !!data),
        takeUntil(this.destroy$)
      )
      .subscribe(data => {
        if (data.lists) {
          this.getActiveTaskList(this.activeListId);
          this.changeDetectorRef.markForCheck();
        }
      })

    this.taskListManager.listId$.pipe(
      filter(listId => !!listId),
      switchMap((listId) => this.loadTaskList(listId)),
      takeUntil(this.destroy$),
    )
    .subscribe(taskList => {
      this.taskList = taskList;
      this.getActiveTaskList(this.activeListId);
      this.changeDetectorRef.markForCheck();
    });

    this.taskListManager.listId$.pipe(
      filter(listId => !listId),
      takeUntil(this.destroy$),
    )
    .subscribe(() => {
      this.activeListId = undefined;
      this.taskList = undefined;
      this.changeDetectorRef.markForCheck();
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  renameTaskList(id: string | undefined, title: string): void {
    if(!id) {
      return;
    }

    this.taskListManager.renameTaskList(id, title);
  }

  deleteTaskListById(id: string | undefined): void {
    if(!id) {
      return;
    }

    this.taskListManager.deleteTaskListById(id);
  }

  getActiveTaskList(id: string | undefined): void {
    if (!this.taskListManager.allTaskLists.value) {
      return
    }

    this.activeTaskList = this.taskListManager.allTaskLists.value.lists.filter(item => item.id === id);
  } 

  addNewTask(title: string): void {
    if (!title) {
      return
    }

    this.apiService.addNewTasks(title, this.activeListId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.changeDetectorRef.markForCheck();
        this.displayTaskList(this.activeListId);
        this.isNewTaskInputVisible = false;
    })
  }

  showNewTaskInput(): void {
    this.isNewTaskInputVisible = true;
  }

  onBlur(): void {
    this.isNewTaskInputVisible = false;
    this.isRenameTaskListVisible = false;
    this.changeDetectorRef.markForCheck();
  }

  private displayTaskList(id: string | undefined): void {
    if(!id) {
      return;
    }

    this.apiService.getTaskList(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(taskList => {
        this.taskList = taskList;
        this.changeDetectorRef.markForCheck();
      })
  }

  private loadTaskList(id: string): Observable<TaskList> {
    return this.apiService.getTaskList(id)
  }
}
