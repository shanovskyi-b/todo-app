import { Injectable } from '@angular/core';
import { TaskGroupsList } from '../models/shared.models';
import { ApiService } from '../api-service/api.service';
import { Observable, ReplaySubject, Subject, map, takeUntil, withLatestFrom } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TaskListManagerService {

  listId$: Observable<string> = this.route.queryParams.pipe(
    map((params): string => params['list']),
  );

  private allTaskListsSubject$ = new ReplaySubject<TaskGroupsList>(1)

  private activeListControlIndexSubject$ = new ReplaySubject<number>(1)

  private destroy$ = new Subject<void>();

  get allTaskLists$(): Observable<TaskGroupsList> {
    return this.allTaskListsSubject$.asObservable();
  }

  get activeListControlIndex$(): Observable<number> {
    return this.activeListControlIndexSubject$.asObservable();
  }

  constructor(private apiService: ApiService, private router: Router, private route: ActivatedRoute) { }

  loadLists(): void {
    this.apiService.getLists()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.allTaskListsSubject$.next(data);
        this.activeListControlIndexSubject$.next(0);
      });
  }

  deleteTaskListById(id: string): void { 
    this.apiService.deleteTaskList(id)
      .pipe(
        withLatestFrom(this.listId$),
        takeUntil(this.destroy$)
      )
      .subscribe(([_data, listId]) => {
        if (listId === id) {
          this.router.navigate([]);
        }
        this.loadLists();
      })
  }

  renameTaskList(id: string, title: string): void {
    this.apiService.renameTaskList(id, title)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadLists();
      });
  }

  changeActiveIndex(index: number) {
    this.activeListControlIndexSubject$.next(index);
  }
}
