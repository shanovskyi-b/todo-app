import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../shared/api-service/api.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TaskGroupsList, TaskList } from '../shared/models/shared.models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListComponent implements OnInit, OnDestroy { 
  allTaskLists: TaskGroupsList | undefined;

  radioBtnGroup: FormGroup = new FormGroup ({
    activeTaskList: new FormControl()
  })

  taskList: TaskList = {tasks: [{id: '', title: 'Let`s Work'}]};

  subscriptionToTaskList: Subscription | undefined;
  subscriptionToTaskGroup: Subscription | undefined;

  constructor(private apiService: ApiService, private changeDetectorRef: ChangeDetectorRef, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadLists();

    this.route.queryParams
      .subscribe(params => {
        if (params['list']) {
          this.radioBtnGroup.controls['activeTaskList'].setValue(params['list']);
          this.loadTaskList(params['list']);
        }
      })
  }

  ngOnDestroy(): void {
    this.subscriptionToTaskList?.unsubscribe();
    this.subscriptionToTaskGroup?.unsubscribe();
  }

  private loadLists() {
    this.subscriptionToTaskList = this.apiService.getLists()
      .subscribe(data => {
        this.allTaskLists = data;
        this.changeDetectorRef.markForCheck();
      })
  }

  loadTaskList(id: string) {
    this.subscriptionToTaskGroup = this.apiService.getTaskList(id)
      .subscribe(data => {
        this.taskList = data;
        this.changeDetectorRef.markForCheck();
      })
  }
}
