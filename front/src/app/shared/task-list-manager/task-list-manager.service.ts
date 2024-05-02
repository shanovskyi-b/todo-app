import { Injectable } from '@angular/core';
import { TaskGroupsList } from '../models/shared.models';
import { ApiService } from '../api-service/api.service';
import { BehaviorSubject, Observable, Subject, map, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TaskListManagerService {

  listId$: Observable<string> = this.route.queryParams.pipe(
    map((params): string => params['list']),
  );

  private allTaskListsSubject$ = new BehaviorSubject<TaskGroupsList | undefined>(undefined)

  private selectedTaskListIndexSubject$ = new BehaviorSubject<number | undefined>(undefined)

  private destroy$ = new Subject<void>();

  get allTaskLists$(): Observable<TaskGroupsList | undefined> {
    return this.allTaskListsSubject$.asObservable();
  }

  get selectedTaskListIndex$(): Observable<number | undefined> {
    return this.selectedTaskListIndexSubject$.asObservable();
  }

  constructor(private apiService: ApiService, private router: Router, private route: ActivatedRoute) { }

  loadLists(): void {
    this.apiService.getLists()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.allTaskListsSubject$.next(data)
      });
  }

  deleteTaskListById(id: string): void { 
    this.apiService.deleteTaskList(id)
      .subscribe(() => {
        this.router.navigate([]);
        this.loadLists();
      })
  }

  renameTaskList(id: string, title: string): void {
    this.apiService.renameTaskList(id, title)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadLists();
        this.selectedTaskListIndexSubject$.next(undefined)
      });
  }

  changeActiveIndex(index: number | undefined) {
    this.selectedTaskListIndexSubject$.next(index);
  }
}
