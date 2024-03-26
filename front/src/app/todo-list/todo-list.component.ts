import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../shared/api-service/api.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskGroupsList, TaskList } from '../shared/models/shared.models';
import { Observable, Subject, filter, map, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListComponent implements OnInit, OnDestroy {
  @ViewChild('newTaskGroupFormField') newTaskGroupFormField: ElementRef | undefined;
  
  allTaskLists: TaskGroupsList | undefined;

  radioBtnGroup: FormGroup = new FormGroup ({
    activeTaskList: new FormControl()
  })

  selectedTaskGroupIndex: number | undefined; 

  taskList: TaskList | undefined;

  isNewTaskGroupFormFieldVisible: boolean = false;

  isResultLoading: boolean = false;

  activeGroupId: string = '';

  private destroy$ = new Subject<void>();

  constructor(private apiService: ApiService, private changeDetectorRef: ChangeDetectorRef, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.loadLists();

    const listId$: Observable<string> = this.route.queryParams.pipe(
      map((params): string => params['list']),
    );
    
    listId$
      .pipe(takeUntil(this.destroy$))
      .subscribe(listId => {
        this.activeGroupId = listId;
        this.radioBtnGroup.controls['activeTaskList'].setValue(listId);
      });

    listId$
      .pipe(
        takeUntil(this.destroy$),
        filter(listId => !!listId),
        switchMap((listId) => this.loadTaskList(listId)),
      )
      .subscribe(taskList => {
        this.taskList = taskList;
        this.changeDetectorRef.markForCheck();
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

  deleteTaskListById(id: string): void {
    this.apiService.deleteTaskList(id)
      .subscribe(() => {
        this.router.navigate([]);
        this.changeDetectorRef.markForCheck();
        this.loadLists();
        this.selectedTaskGroupIndex = undefined;
      })
  }

  // blur is triggered before the button, I had to make a slight delay in these two functions
  onRenameTaskGroupInputBlur(): void {
    setTimeout(() => {
      this.selectedTaskGroupIndex = undefined;
      this.changeDetectorRef.markForCheck();
    }, 150)
  }

  hideNewTaskGroupFormField(): void {
    setTimeout(() => {
      this.isNewTaskGroupFormFieldVisible = false;
      this.changeDetectorRef.markForCheck();
    }, 150)
  }

  showRenameTaskGroupInput(taskListIndex: number, taskListTitle: string, renameTaskListInput: HTMLInputElement): void {
    this.selectedTaskGroupIndex = taskListIndex;
    renameTaskListInput.value = taskListTitle;
    this.changeDetectorRef.detectChanges();
    renameTaskListInput.focus();
  }

  renameTaskGroup(id: string, title: string): void {
    this.apiService.renameTaskGroup(id, title)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.changeDetectorRef.markForCheck();
        this.loadLists();
        this.selectedTaskGroupIndex = undefined;
      });
  }

  showNewTaskGroupFormField(): void {
    this.isNewTaskGroupFormFieldVisible = true;
    this.changeDetectorRef.detectChanges()
    this.newTaskGroupFormField?.nativeElement.focus();
  }

  createNewTaskGroup(name: string): void {
    if (!name) {
      return;
    }

    this.isResultLoading = true;

    this.apiService.createTaskGroup(name)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const list = data.list.id;
        this.changeDetectorRef.markForCheck();
        this.loadLists();
        this.router.navigate([], {queryParams: {list}});
        this.isResultLoading = false;
      })

    this.isNewTaskGroupFormFieldVisible = false;
  }

  private loadLists(): void {
    this.apiService.getLists()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.allTaskLists = data;
        this.changeDetectorRef.markForCheck();
      });
  }

  private loadTaskList(id: string): Observable<TaskList> {
    return this.apiService.getTaskList(id)
  }
}
