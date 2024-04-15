import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../shared/api-service/api.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskGroupsList, TaskList } from '../shared/models/shared.models';
import { Observable, Subject, map, takeUntil } from 'rxjs';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListComponent implements OnInit, OnDestroy {
  @ViewChild('newTaskListFormField') newTaskListFormField: ElementRef | undefined;
  
  allTaskLists: TaskGroupsList | undefined;

  radioBtnGroup: FormGroup = new FormGroup ({
    activeTaskList: new FormControl()
  })

  selectedTaskListIndex: number | undefined; 

  taskList: TaskList | undefined;

  isNewTaskListFormFieldVisible: boolean = false;

  isResultLoading: boolean = false;

  activeListId: string = '';

  taskListInputValue: string = '';

  listId: Observable<string> | undefined;

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
        this.activeListId = listId;
        this.radioBtnGroup.controls['activeTaskList'].setValue(listId);
      });
    this.listId = listId$;
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
        this.selectedTaskListIndex = undefined;
      })
  }

  onBlur(): void {
    this.selectedTaskListIndex = undefined;
    this.isNewTaskListFormFieldVisible = false;
    this.changeDetectorRef.markForCheck();
  }

  showRenameTaskListInput(taskListIndex: number, taskListTitle: string): void {
    this.selectedTaskListIndex = taskListIndex;
    this.taskListInputValue = taskListTitle;
  }

  renameTaskList(id: string, title: string): void {
    this.apiService.renameTaskList(id, title)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.changeDetectorRef.markForCheck();
        this.loadLists();
        this.selectedTaskListIndex = undefined;
      });
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
        this.loadLists();
        this.router.navigate([], {queryParams: {list}});
        this.isResultLoading = false;
      })

    this.isNewTaskListFormFieldVisible = false;
  }

  private loadLists(): void {
    this.apiService.getLists()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.allTaskLists = data;
        this.changeDetectorRef.markForCheck();
      });
  }
}
