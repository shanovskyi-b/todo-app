import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../shared/api-service/api.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TaskGroups } from '../shared/models/shared.models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListComponent implements OnInit, OnDestroy { 
  allTaskLists: TaskGroups | undefined;

  radioBtnGroup: FormGroup = new FormGroup ({
    activeTaskList: new FormControl()
  })

  subscriptionToTaskList: Subscription | undefined;

  constructor(private apiService: ApiService, private changeDetectorRef: ChangeDetectorRef, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadTaskLists();

    this.route.queryParams
      .subscribe(params => {
        if (params['list']) {
          this.radioBtnGroup.controls['activeTaskList'].setValue(params['list'])
        }
      })
  }

  ngOnDestroy(): void {
    this.subscriptionToTaskList?.unsubscribe();
  }

  private loadTaskLists() {
    this.subscriptionToTaskList = this.apiService.getLists()
      .subscribe(data => {
        this.allTaskLists = data;
        this.changeDetectorRef.markForCheck();
      })
  }
}
