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
  @ViewChild('groupinp') grpInp: ElementRef | undefined;

  allTaskLists: TaskGroupsList | undefined;

  radioBtnGroup: FormGroup = new FormGroup ({
    activeTaskList: new FormControl()
  })
  
  closeInput: boolean = true;

  inputText: string = '';

  taskList: TaskList | undefined;

  load: boolean = false;

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

  displayInput(): void {
    this.closeInput = false;
    this.changeDetectorRef.detectChanges()
    this.grpInp?.nativeElement.focus();
  }

  hideInput(): void {
    this.closeInput = true;
  }

  createNewTskGroup(name: string): void {
    this.load = true
    if (name != '') {
      this.apiService.createTaskGroup(name)
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
          let list = data.list.id;
          this.changeDetectorRef.markForCheck();
          this.loadLists();
          this.router.navigate([], {queryParams: {list}})
        })
    }
    this.closeInput = true;
    this.load = false;
    this.inputText = '';
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
