import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TaskList } from '../../../shared/models/shared.models';
import { Observable, Subject, filter, switchMap, takeUntil } from 'rxjs';
import { ApiService } from '../../../shared/api-service/api.service';

@Component({
  selector: 'app-active-task-list',
  templateUrl: './active-task-list.component.html',
  styleUrl: './active-task-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActiveTaskListComponent implements OnDestroy, OnInit {
  @Input() listId$: Observable<string> | undefined;

  taskList: TaskList | undefined;

  isNewTaskInputVisible: boolean = false;

  activeListId: string = '';

  private destroy$ = new Subject<void>();

  constructor(public apiService: ApiService, private changeDetectorRef: ChangeDetectorRef) {
  } 

  ngOnInit(): void {
    this.listId$?.pipe(
      filter(listId => !!listId),
      switchMap((listId) => this.loadTaskList(listId)),
      takeUntil(this.destroy$),
    )
    .subscribe(taskList => {
      this.taskList = taskList;
      this.changeDetectorRef.markForCheck();
    });

    this.listId$?.pipe(
      takeUntil(this.destroy$)
    )
    .subscribe(listId => {
      this.activeListId = listId;
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

  //blur triggers too early, needs a little delay
  onBlur(): void {
    setTimeout(() => {
      this.isNewTaskInputVisible = false;
      this.changeDetectorRef.markForCheck();
    }, 150)
  }

  private displayTaskList(id: string): void {
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
