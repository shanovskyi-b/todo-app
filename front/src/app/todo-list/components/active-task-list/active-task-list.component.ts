import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TaskGroup, TaskGroupsList, TaskList } from '../../../shared/models/shared.models';
import { BehaviorSubject, Observable, Subject, combineLatest, filter, first, map, takeUntil } from 'rxjs';
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
 
  taskList$ = new BehaviorSubject<TaskList | undefined>(undefined);

  isNewTaskInputVisible: boolean = false;

  activeListId$: Observable<string> = this.taskListManager.listId$;

  allTaskLists$: Observable<TaskGroupsList> = this.taskListManager.allTaskLists$.pipe(
    filter<TaskGroupsList | undefined, TaskGroupsList>((data): data is TaskGroupsList => !!data),
  );

  activeTaskGroup$: Observable<TaskGroup> = combineLatest(
    [this.allTaskLists$, this.taskListManager.listId$]
  ).pipe(
    map(([allTaskLists, listId]) => {
      return allTaskLists.lists.find(list => list.id === listId) as TaskGroup;
    })
  );

  private destroy$ = new Subject<void>();

  constructor(private apiService: ApiService, private taskListManager: TaskListManagerService, private changeDetectorRef: ChangeDetectorRef) {
  } 

  ngOnInit(): void {
    this.taskListManager.allTaskLists$
      .pipe(
        filter<TaskGroupsList | undefined, TaskGroupsList>((data): data is TaskGroupsList => !!data),
        takeUntil(this.destroy$)
      )
      .subscribe(data => {
        if (data.lists) {
          this.changeDetectorRef.markForCheck();
        }
      })

    this.taskListManager.listId$.pipe(
      filter(listId => !!listId),
      takeUntil(this.destroy$),
    )
    .subscribe(listId => {
      this.getTaskList(listId)
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  renameTaskList(title: string): void {
    this.activeListId$
      .pipe(
        first(),
        takeUntil(this.destroy$)
      )
      .subscribe(id => {
        this.taskListManager.renameTaskList(id, title);
      })
  }

  deleteTaskListById(): void {
    this.activeListId$
      .pipe(
        first(),
        takeUntil(this.destroy$)
      )
      .subscribe(id => {
        this.taskListManager.deleteTaskListById(id);
      })
  }

  addNewTask(title: string): void {
    if (!title || !this.activeListId$) {
      return
    }

    this.activeListId$
      .pipe(
        first(),
        takeUntil(this.destroy$)
      )
      .subscribe(id => {
        this.apiService.addNewTasks(title, id)
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe(() => {
          this.changeDetectorRef.markForCheck();
          this.getTaskList(id);
          this.isNewTaskInputVisible = false;
      })
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

  private getTaskList(id: string): void {
    this.apiService.getTaskList(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(taskList => {
        this.taskList$.next(taskList)
        this.changeDetectorRef.markForCheck();
      })
  } 
}
