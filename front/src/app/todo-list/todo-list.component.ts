import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../shared/api-service/api.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject, combineLatestWith, fromEvent, map, startWith, takeUntil } from 'rxjs';
import { TaskListManagerService } from '../shared/task-list-manager/task-list-manager.service';
import { TaskGroup } from '../shared/models/shared.models';
import { MatDrawerMode } from '@angular/material/sidenav';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListComponent implements OnInit, OnDestroy {
  @ViewChild('newTaskListFormField') newTaskListFormField: ElementRef | undefined;

  radioBtnGroup: FormGroup = new FormGroup ({
    activeTaskList: new FormControl(),
    searchListValue: new FormControl(''),
  })

  filteredLists$: Observable<TaskGroup[]> = this.taskListManager.allTaskLists$
    .pipe(
      combineLatestWith(
        this.radioBtnGroup.controls['searchListValue'].valueChanges
        .pipe(
          startWith(this.radioBtnGroup.controls['searchListValue'].value)
        )
      ),
      map(([allTaskLists, value]) => {
        return allTaskLists.lists.filter(
          list => list.title
            .trim()
            .toLowerCase()
            .includes(value.trim().toLowerCase())
          )
      })
    )

  activeListControlIndex$ = this.taskListManager.activeListControlIndex$;

  isNewTaskListFormFieldVisible: boolean = false;

  isResultLoading: boolean = false;

  activeListId: string = '';

  taskListInputValue: string = '';

  resize$ = fromEvent(window, 'resize');

  sidebarMode: MatDrawerMode = 'side';

  isSidebarOpen: boolean = true;

  isNormalWindowSize: boolean | undefined;

  isSmallWindowSize: boolean | undefined;

  private destroy$ = new Subject<void>();

  constructor(private taskListManager: TaskListManagerService, private apiService: ApiService, private changeDetectorRef: ChangeDetectorRef, private router: Router) {}

  ngOnInit(): void {
    this.resize$
      .pipe(
        startWith(undefined),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.isNormalWindowSize = document.documentElement.clientWidth > 750;
        this.isSmallWindowSize = document.documentElement.clientWidth <= 750;

        this.sidebarMode = this.isNormalWindowSize 
          ? 'side'
          : 'over';
        this.changeDetectorRef.markForCheck();
      });

    this.isSidebarOpen = this.isNormalWindowSize
    ? (localStorage.getItem('sidebarOpen') === 'true')
    : false
 
    this.taskListManager.loadLists();

    this.taskListManager.listId$
      .pipe(takeUntil(this.destroy$))
      .subscribe(listId => {
        if (!listId && this.isSmallWindowSize) {
          this.toggleSidebar();
        }

        this.activeListId = listId;
        this.radioBtnGroup.controls['activeTaskList'].setValue(listId);
      });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen
    localStorage.setItem('sidebarOpen', this.isSidebarOpen.toString());
    this.changeDetectorRef.markForCheck()
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
    this.taskListManager.changeActiveIndex(0);
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
