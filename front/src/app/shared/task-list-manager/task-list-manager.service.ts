import { Injectable } from '@angular/core';
import { TaskGroupsList } from '../models/shared.models';
import { ApiService } from '../api-service/api.service';
import { BehaviorSubject, Observable, Subject, map, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TaskListManagerService {

  allTaskLists = new BehaviorSubject<TaskGroupsList | undefined>(undefined)

  selectedTaskListIndex = new BehaviorSubject<number | undefined>(undefined) 

  listId$: Observable<string> = this.route.queryParams.pipe(
    map((params): string => params['list']),
  );

  private destroy$ = new Subject<void>();

  constructor(private apiService: ApiService, private router: Router, private route: ActivatedRoute) { }

  loadLists(): void {
    this.apiService.getLists()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.allTaskLists.next(data)
      });
  }

  deleteTaskListById(id: string): void { 
    this.apiService.deleteTaskList(id)//
      .subscribe(() => {
        this.router.navigate([]);
        this.loadLists();
        this.selectedTaskListIndex.next(undefined)
      })
  }

  renameTaskList(id: string, title: string): void {
    this.apiService.renameTaskList(id, title)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadLists();
        this.selectedTaskListIndex.next(undefined)
      });
  }
}
