import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy } from '@angular/core';
import { TaskList } from '../../../shared/models/shared.models';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from '../../../shared/api-service/api.service';

@Component({
  selector: 'app-active-task-group',
  templateUrl: './active-task-group.component.html',
  styleUrl: './active-task-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActiveTaskGroupComponent implements OnDestroy {
  @Input() taskList: TaskList | undefined;
  @Input() activeGroupId: string = '';

  isNewTaskInputVisible: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(public apiService: ApiService, private changeDetectorRef: ChangeDetectorRef) {
  } 

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addNewTask(title: string): void {
    if (title) {
      this.apiService.addNewTasks(title, this.activeGroupId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.changeDetectorRef.markForCheck();
          this.displayTaskList(this.activeGroupId);
          this.isNewTaskInputVisible = false;
      })
    }
  }

  showNewTaskInput(newTaskInput: HTMLInputElement): void {
    this.isNewTaskInputVisible = true;
    newTaskInput.value = '';
    this.changeDetectorRef.detectChanges();
    newTaskInput.focus();
  }

  //blur triggers too early, needs a little delay
  onNewTaskInputBlur(): void {
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
}
