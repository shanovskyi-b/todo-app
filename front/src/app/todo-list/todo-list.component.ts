import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService, Lists } from '../shared/services/Api.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListComponent implements OnInit{

  allTaskLists: Lists;

  radioBtnGroup: FormGroup = new FormGroup ({
    activeTaskList: new FormControl()
  })

  constructor(public apiService: ApiService, private changeDetectorRef: ChangeDetectorRef, public formBuilder: FormBuilder, private route: ActivatedRoute) {
    
  }

  ngOnInit(): void {
    this.loadTaskLists();
    this.route.queryParams
      .subscribe(params => {
        if (params['list'] != undefined) {
          this.radioBtnGroup = new FormGroup ({
            activeTaskList: new FormControl(params['list'])
          })
        }
      })
  }
  
  loadTaskLists() {
    this.apiService.getLists()
      .subscribe(data => {
        this.allTaskLists = data;
        this.changeDetectorRef.markForCheck();
      })
  }
}
